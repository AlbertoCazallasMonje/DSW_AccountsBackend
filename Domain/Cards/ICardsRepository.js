
class ICardsRepository {
    async CreateCard(dni, account){
        throw new Error('Error while creating a card.');
    }
    async ValidateCard(card){
        throw new Error('Error while validating a card.');
    }

    async SearchCards(b_id) {
        throw new Error('Error while searching cards.');
    }
}
module.exports = ICardsRepository;