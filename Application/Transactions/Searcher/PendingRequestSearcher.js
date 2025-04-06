class PendingRequestSearcher {
    constructor(transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    async Execute(sender_dni) {
        return await this.transactionsRepository.GetPendingTransactionsBySender(sender_dni);
    }
}

module.exports = PendingRequestSearcher;
