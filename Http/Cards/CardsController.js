const CardCreator = require('../../Application/Cards/Creator/CardCreator');
const CardRepository = require('../../Infrastructure/Cards/CardsRepository');
const AccountRepository = require('../../Infrastructure/Accounts/AccountsRepository');

class CardsController {
    async CreateCard(req, res) {
        try {
            const accountRepository = new AccountRepository();
            const cardRepository = new CardRepository();
            const cardCreator = new CardCreator(cardRepository, accountRepository);
            await cardCreator.Execute(req.body);
            res.status(201).json({message: 'Card created successfully'});
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}
module.exports = CardsController;