
class CardValidator {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async Execute(card) {
        const numberRegex = /^\d{16}$/;
        if (!card.cc_number || !numberRegex.test(card.cc_number)) {
            return false;
        }

        const cvvRegex = /^\d{3}$/;
        if (!card.cc_cvv || !cvvRegex.test(card.cc_cvv)) {
            return false;
        }

        const expirationDate = new Date(card.cc_expirationDate);
        if (isNaN(expirationDate.getTime()) || expirationDate < new Date()) {
            return false;
        }

        return await this.cardRepository.ValidateCard(card);
    }
}

module.exports = CardValidator;