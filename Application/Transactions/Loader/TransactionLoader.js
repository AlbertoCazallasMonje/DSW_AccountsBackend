class TransactionLoader {
    constructor(transactionsRepository) {
        this._transactionsRepository = transactionsRepository;
    }

    async Execute() {
        return await this._transactionsRepository.LoadTransactions();
    }
}

module.exports = TransactionLoader;