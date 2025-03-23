const {Create} = require("../../../Domain/TopUps/TopUp.domain");

class TopUpAdder{
    constructor(topUpRepository, accountRepository) {
        this.topUpRepository = topUpRepository;
        this.accountRepository = accountRepository;
    }

    async Execute(dni, quantity) {
        try {
            const accountId = await this.accountRepository.FindAccountByDni({dni});

            const topUp = Create({
                u_dni: dni,
                amount: quantity,
                created_at: new Date()
            });
            await this.topUpRepository.AddMoneyToAccount(topUp);
            await this.accountRepository.UpdateBalance(accountId, quantity);
        } catch (err) {
            console.error('Error while adding money to account.', err);
            throw err;
        }
    }
}
module.exports = TopUpAdder;