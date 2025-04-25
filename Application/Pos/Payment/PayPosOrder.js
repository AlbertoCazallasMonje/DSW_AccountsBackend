const stripe = require('../../../Http/StripeService');


class PayPosOrder {
    constructor(posOrdersRepository, transactionRepository, accountRepository) {
        this.posOrdersRepo = posOrdersRepository;
        this.transactionsRepo = transactionRepository;
        this.accountRepo = accountRepository;
    }

    async Execute(posId, buyerDni, paymentMethodId = null, existingTxId = null) {
        const order = await this.posOrdersRepo.GetOrderById(posId);
        if (!order)                                   throw new Error(`POS Order ${posId} not found`);
        if (order.transaction_id)                     throw new Error('Order already paid');
        if (new Date(order.expires_at) < new Date())  throw new Error('Expired Order');

        if (paymentMethodId) {
            const pi = await stripe.paymentIntents.create({
                amount:             Math.round(order.amount * 100),
                currency:           'eur',
                payment_method:     paymentMethodId,
                confirm:            true,
                payment_method_types:['card']
            });
            if (pi.status !== 'succeeded') {
                throw new Error(`Failed payment: ${pi.status}`);
            }
        } else {
            const sender   = await this.accountRepo.FindAccountByDni({ dni: buyerDni });
            const receiver = await this.accountRepo.FindAccountByDni({ dni: order.merchant_dni });
            if (!sender || sender.b_balance < order.amount) throw new Error('Insufficient balance');
            await this.accountRepo.UpdateBalance({ b_id: receiver.b_id },  order.amount);
        }

        let txId = existingTxId;
        if (!txId) {
            const txData = {
                sender_dni:   buyerDni,
                receiver_dni: order.merchant_dni,
                t_message:    paymentMethodId ? 'POS payment (card)' : order.description,
                amount:       order.amount,
                t_state:      'ACCEPTED',
                t_date:       new Date(),
                split_group_id: null
            };
            const createdTx = await this.transactionsRepo.CreateTransaction(txData);
            txId = createdTx.t_id;
        }

        await this.posOrdersRepo.UpdateOrderStatus(posId, txId, new Date());

        return {
            transactionId: txId,
            method:        paymentMethodId ? 'card' : 'balance'
        };
    }
}

module.exports = PayPosOrder;