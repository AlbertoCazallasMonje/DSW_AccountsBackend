const { v4: uuidv4 } = require('uuid');
const PosOrderDomain = require("./PosOrder.domain");
class PosOrder {
    constructor({
                    pos_id,
                    merchant_dni,
                    amount,
                    description = null,
                    created_at = new Date(),
                    expires_at,
                    transaction_id = null,
                    payment_provider = 'INTERNAL',
                    provider_reference = null,
                    completed_at = null
                }) {
        this.setPos_id(pos_id);
        this.setMerchantDni(merchant_dni);
        this.setAmount(amount);
        this.setDescription(description);
        this.setCreatedAt(created_at);
        this.setExpiresAt(expires_at);
        this.setTransactionId(transaction_id);
        this.setPaymentProvider(payment_provider);
        this.setProviderReference(provider_reference);
        this.setCompletedAt(completed_at);
    }

    // Getters
    getPosId() { return this._pos_id; }
    getMerchantDni() { return this._merchant_dni; }
    getAmount() { return this._amount; }
    getDescription() { return this._description; }
    getCreatedAt() { return this._created_at; }
    getExpiresAt() { return this._expires_at; }
    getTransactionId() { return this._transaction_id; }
    getPaymentProvider() { return this._payment_provider; }
    getProviderReference() { return this._provider_reference; }
    getCompletedAt() { return this._completed_at; }

    // Setters
    setPos_id(pos_id) {
        if (!pos_id) {
            pos_id = uuidv4();
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(pos_id)) throw new Error('pos_id must be a valid GUID');
        this._pos_id = pos_id;
    }

    setMerchantDni(merchant_dni) {
        if (!merchant_dni) throw new Error('merchant_dni is required');
        if (typeof merchant_dni !== 'string' || merchant_dni.length > 9) {
            throw new Error('merchant_dni must be a string up to 9 characters');
        }
        this._merchant_dni = merchant_dni;
    }

    setAmount(amount) {
        if (amount == null) throw new Error('amount is required');
        if (typeof amount !== 'number') throw new Error('amount must be a number');
        this._amount = parseFloat(amount.toFixed(2));
    }

    setDescription(description) {
        if (description != null) {
            if (typeof description !== 'string' || description.length > 200) {
                throw new Error('description must be a string up to 200 characters');
            }
            this._description = description;
        } else {
            this._description = null;
        }
    }

    setCreatedAt(created_at) {
        const date = new Date(created_at);
        if (isNaN(date.getTime())) throw new Error('created_at must be a valid date');
        this._created_at = date;
    }

    setExpiresAt(expires_at) {
        const date = new Date(expires_at);
        if (isNaN(date.getTime())) throw new Error('expires_at must be a valid date');
        if (date <= this._created_at) throw new Error('expires_at must be after created_at');
        this._expires_at = date;
    }

    setTransactionId(transaction_id) {
        if (transaction_id != null) {
            const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!guidRegex.test(transaction_id)) throw new Error('transaction_id must be a valid GUID or null');
            this._transaction_id = transaction_id;
        } else {
            this._transaction_id = null;
        }
    }

    setPaymentProvider(payment_provider) {
        if (!payment_provider) throw new Error('payment_provider is required');
        if (typeof payment_provider !== 'string' || payment_provider.length > 20) {
            throw new Error('payment_provider must be a string up to 20 characters');
        }
        this._payment_provider = payment_provider;
    }

    setProviderReference(provider_reference) {
        if (provider_reference != null) {
            if (typeof provider_reference !== 'string' || provider_reference.length > 255) {
                throw new Error('provider_reference must be a string up to 255 characters');
            }
            this._provider_reference = provider_reference;
        } else {
            this._provider_reference = null;
        }
    }

    setCompletedAt(completed_at) {
        if (completed_at != null) {
            const date = new Date(completed_at);
            if (isNaN(date.getTime())) throw new Error('completed_at must be a valid date or null');
            if (date < this._created_at) throw new Error('completed_at cannot be before created_at');
            this._completed_at = date;
        } else {
            this._completed_at = null;
        }
    }
}
module.exports = PosOrder;