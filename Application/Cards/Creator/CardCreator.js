const { v4: uuidv4 } = require('uuid');
const CardsDomain = require('../../../Domain/Cards/Card.domain');
class CardCreator {
    constructor(cardRepository, accountRepository) {
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    async Execute(dni) {
        try {
            const account = await this.accountRepository.FindAccountByDni(dni);

            const cc_id = this._generateCcId();
            const cc_number = this._generateCcNumber();
            const cc_expirationDate = this._generateCcExpirationDate();
            const cc_cvv = this._generateCcCvv();

            const card = CardsDomain.Create({
                cc_id,
                b_id: account.b_id,
                cc_number,
                cc_expirationDate,
                cc_cvv
            });

            return await this.cardRepository.CreateCard(card);
        } catch (err) {
            console.error('Error while creating a card.', err);
            throw err;
        }
    }

    _generateCcId() {
        return uuidv4();
    }

    _generateCcNumber() {
        const digits = '0123456789';
        let cc_number = '';
        for (let i = 0; i < 16; i++) {
            cc_number += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return cc_number;
    }

    _generateCcExpirationDate() {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 3);
        return expirationDate;
    }

    _generateCcCvv() {
        const digits = '0123456789';
        let cc_cvv = '';
        for (let i = 0; i < 3; i++) {
            cc_cvv += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return cc_cvv;
    }
}

module.exports = CardCreator;