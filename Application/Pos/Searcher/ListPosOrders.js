class ListPosOrders {
    constructor(posOrdersRepository) {
        this.posOrdersRepo = posOrdersRepository;
    }

    async Execute(merchantDni, status = null) {
        return await this.posOrdersRepo.GetOrdersByMerchant(merchantDni, status);
    }
}

module.exports = ListPosOrders;