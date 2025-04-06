
class RequestResolver {
    constructor(transactionsRepository, accountRepository) {
        this.transactionsRepository = transactionsRepository;
        this.accountRepository = accountRepository;
    }

    async Execute(sessionUser_dni, transactionId, resolution) {
        const transaction = await this.transactionsRepository.GetTransactionById(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.dni_sender !== sessionUser_dni) {
            throw new Error("Unauthorized resolution: session user is not the designated sender");
        }

        if (resolution === 'ACCEPTED') {
            const senderAccount = await this.accountRepository.FindAccountByDni({ dni: transaction.dni_sender });
            const receiverAccount = await this.accountRepository.FindAccountByDni({ dni: transaction.dni_receiver });
            if (!senderAccount || !receiverAccount) {
                throw new Error("Accounts not found");
            }

            await this.accountRepository.UpdateBalance({ b_id: senderAccount.b_id }, -transaction.amount);
            await this.accountRepository.UpdateBalance({ b_id: receiverAccount.b_id }, transaction.amount);
            await this.transactionsRepository.UpdateTransactionStatus(transactionId, 'ACCEPTED');
        } else if (resolution === 'DENIED') {
            await this.transactionsRepository.UpdateTransactionStatus(transactionId, 'DENIED');
        } else {
            throw new Error("Invalid resolution value");
        }
    }
}
module.exports = RequestResolver;