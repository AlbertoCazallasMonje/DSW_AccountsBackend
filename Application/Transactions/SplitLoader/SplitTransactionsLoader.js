class SplitTransactionsLoader {
    constructor(transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    async Execute(receiverDni) {
        return await this.transactionsRepository
            .GetSplitTransactionsByReceiver({ dni: receiverDni });
    }
}
module.exports = SplitTransactionsLoader;