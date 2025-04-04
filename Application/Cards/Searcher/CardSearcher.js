const AccountsRepository = require("../../../Infrastructure/Accounts/AccountsRepository");

class CardSearcher {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
        this.accountRepository = new AccountsRepository();
    }

    async Execute(dni) {
        const account = await this.accountRepository.FindAccountByDni({dni});
        if (!account) {
            throw new Error('Error finding the user account.');
        }
        const b_id = account.b_id;
        return await this.cardRepository.SearchCards(b_id);
    }
}
module.exports = CardSearcher;