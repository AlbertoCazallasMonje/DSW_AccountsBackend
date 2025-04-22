const PosOrder = require("./PosOrder");
const { v4: uuidv4 } = require("uuid");

class PosOrderDomain {
    static Create({
                      pos_id,
                      merchant_dni,
                      amount,
                      description = null,
                      created_at,
                      expires_at,
                      transaction_id,
                      payment_provider,
                      provider_reference,
                      completed_at
                  }) {
        return new PosOrder({
            pos_id:            pos_id || uuidv4(),
            merchant_dni,
            amount,
            description,
            created_at:        created_at   || new Date(),
            expires_at,
            transaction_id:    transaction_id || null,
            payment_provider,
            provider_reference,
            completed_at:      completed_at   || null
        });
    }
}
module.exports = PosOrderDomain;
