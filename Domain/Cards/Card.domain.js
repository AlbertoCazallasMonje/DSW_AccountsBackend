const Card = require('../../Domain/Cards/Card');

class CardDomain{
    static Create({ cc_id, b_id, cc_number, cc_expirationDate, cc_cvv }) {
        return new Card({ cc_id, b_id, cc_number, cc_expirationDate, cc_cvv });
    }
}
module.exports = CardDomain;