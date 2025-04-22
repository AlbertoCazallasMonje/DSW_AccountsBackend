const stripe = require('../../../Http/StripeService');


class PayPosOrder {
    constructor(posOrdersRepository, transactionRepository, accountRepository) {
        this.posOrdersRepo = posOrdersRepository;
        this.transactionsRepo = transactionRepository;
        this.accountRepo = accountRepository;
    }

    async Execute(posId, buyerDni, paymentMethodId = null) {
        const order = await this.posOrdersRepo.GetOrderById(posId);
        if (!order) throw new Error(`POS Order ${posId} not found`);
        if (order.transaction_id) throw new Error('Order already payed');
        if (new Date(order.expires_at) < new Date()) throw new Error('Expired Order');

        if (paymentMethodId) {
            const pi = await stripe.paymentIntents.create({
                amount:               Math.round(parseFloat(order.amount) * 100),
                currency:             'eur',
                payment_method:       paymentMethodId,
                confirm:              true,
                payment_method_types: ['card']
            });
            if (pi.status !== 'succeeded') {
                throw new Error(`Failed payment (status=${pi.status})`);
            }
        } else {
            const sender   = await this.accountRepo.FindAccountByDni({ dni: buyerDni });
            const receiver = await this.accountRepo.FindAccountByDni({ dni: order.merchant_dni });
            if (!sender)   throw new Error('User account not found');
            if (!receiver) throw new Error('Merchant account not found');
            const amt = parseFloat(order.amount);
            if (sender.b_balance < amt) throw new Error('Balance is not enough');
            await this.accountRepo.UpdateBalance({ b_id: sender.b_id },  -amt);
            await this.accountRepo.UpdateBalance({ b_id: receiver.b_id }, amt);
        }

        const txData = {
            sender_dni:     buyerDni,
            receiver_dni:   order.merchant_dni,
            t_message:      paymentMethodId
                ? 'POS payment with card'
                : order.description,
            amount:         parseFloat(order.amount),
            t_state:        'ACCEPTED',
            t_date:         new Date(),
            split_group_id: null
        };
        const createdTx = await this.transactionsRepo.CreateTransaction(txData);

        await this.posOrdersRepo.UpdateOrderStatus(
            posId,
            createdTx.t_id,
            new Date()
        );

        return {
            transactionId: createdTx.t_id,
            method:        paymentMethodId ? 'card' : 'balance'
        };
    }
}

module.exports = PayPosOrder;