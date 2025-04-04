const { v4: uuidv4 } = require('uuid');
const CardsDomain = require('../../../Domain/Cards/Card.domain');
class CardCreator {
    constructor(cardRepository, accountRepository) {
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    async Execute({ dni, cc_number, cc_expirationDate, cc_cvv }) {
        try {
            if (!/^\d{16}$/.test(cc_number)) {
                throw new Error('Error in card format: Card number must contain 16 numeric characters.');
            }
            if (!/^\d{3}$/.test(cc_cvv)) {
                throw new Error('Error in card format: CVV must contain 3 numeric characters.');
            }

            const expirationDate = new Date(cc_expirationDate);
            if (isNaN(expirationDate.getTime())) {
                throw new Error('Error in card format: Invalid expiration date format.');
            }
            if (expirationDate <= new Date()) {
                throw new Error('Error in card format: Invalid expiration date.');
            }

            const account = await this.accountRepository.FindAccountByDni({dni});
            if (!account) {
                throw new Error('Error finding user account.');
            }

            const cc_id = uuidv4();
            const card = CardsDomain.Create({
                cc_id,
                b_id: account.b_id,
                cc_number,
                cc_expirationDate: expirationDate,
                cc_cvv
            });

            return await this.cardRepository.CreateCard(card);
        } catch (err) {
            console.error('Error creating the card.', err);
            throw err;
        }
    }
}

module.exports = CardCreator;