const PosOrderDomain = require('../../../Domain/Pos/PosOrder.domain');
const stripe = require('../../../Http/StripeService');
const { v4: uuidv4 } = require('uuid');

class CreatePosOrder {
    constructor(posOrdersRepository, accountRepository) {
        this.posOrdersRepo = posOrdersRepository;
        this.accountRepo = accountRepository;
    }

    async Execute(merchantDni, amount, description, expiresAt) {
        try {
            await this.accountRepo.FindAccountByDni({ dni: merchantDni });
        } catch {
            await this.accountRepo.Create({ b_id: undefined, u_dni: merchantDni, b_country: 'ES', b_IBAN: null, b_balance: 0 });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount:   Math.round(amount * 100),
            currency: 'eur',
            metadata: { merchant_dni: merchantDni },
        });

        const posId = uuidv4();

        const order = PosOrderDomain.Create({
            pos_id:            posId,
            merchant_dni:      merchantDni,
            amount,
            description,
            created_at:        new Date(),
            expires_at:        expiresAt,
            transaction_id:    null,
            payment_provider:  'stripe',
            provider_reference: paymentIntent.id,
            completed_at:      null
        });

        const created = await this.posOrdersRepo.CreateOrder(order);

        return {
            pos_id:       created.pos_id,
            clientSecret: paymentIntent.client_secret
        };
    }
}

module.exports = CreatePosOrder;