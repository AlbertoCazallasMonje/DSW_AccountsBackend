class TransactionCreator {
    constructor(transactionRepository, accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    async Execute(sender_dni, receiver_dni, amount) {
        try {
            const senderAccount = await this.accountRepository.FindAccountByDni({ dni: sender_dni });
            if (!senderAccount) {
                throw new Error("Sender account not found.");
            }

            if (senderAccount.b_balance < amount) {
                throw new Error("Insufficient balance.");
            }

            const receiverAccount = await this.accountRepository.FindAccountByDni({ dni: receiver_dni });
            if (!receiverAccount) {
                throw new Error("Receiver account not found.");
            }

            const transaction = {
                sender_dni: sender_dni,
                receiver_dni: receiver_dni,
                amount: amount,
                t_state: 'ACCEPTED',
                created_at: new Date()
            };


            const createdTx =  await this.transactionRepository.CreateTransaction(transaction);
            await this.accountRepository.UpdateBalance({ b_id: senderAccount.b_id }, -amount);
            await this.accountRepository.UpdateBalance({ b_id: receiverAccount.b_id }, amount);
            return createdTx;
        } catch (err) {
            console.error('Error while creating transaction.', err);
            throw err;
        }
    }
}

module.exports = TransactionCreator;
