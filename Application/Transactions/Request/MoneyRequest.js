
class MoneyRequest {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    async Execute(requester_dni, requested_dni, amount, message) {
        const transaction = {
            sender_dni: requested_dni,
            receiver_dni: requester_dni,
            t_message: message || null,
            amount: parseFloat(amount.toFixed(2)),
            t_state: 'PENDING',
            t_date: new Date()
        };

        return await this.transactionRepository.CreateTransaction(transaction);
    }


}
module.exports = MoneyRequest;