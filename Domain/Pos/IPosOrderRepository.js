
class IPosOrderRepository{
    async CreateOrder(order) {
        throw new Error('Error while creating a pos.');
    }

    async GetOrderById(pos_id) {
        throw new Error('Error while getting pos with id ' + pos_id);
    }

    async GetOrdersByMerchant(merchant_dni, status = null) {
        throw new Error('Error while getting pos for id ' + merchant_dni);
    }

    async UpdateOrderStatus(pos_id, newStatus, transaction_id = null, completedAt = new Date()) {
        throw new Error('Error while updating pos with id ' + pos_id);
    }

    async GetExpiredPendingOrders() {
        throw new Error('Error while getting expired orders');
    }

    async GetOrderByProviderReference(providerReference) {
        throw new Error('Error while getting pos for id ' + providerReference);
    }
}
module.exports = IPosOrderRepository;