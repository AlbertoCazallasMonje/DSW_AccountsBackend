
class ICardsRepository {
    async CreateCard(dni, account){
        throw new Error('Error while creating a card.');
    }
}
module.exports = ICardsRepository;