
class ITopUpRepository{
    async AddMoneyToAccount(topUp){
        throw new Error('Error while adding money to account.');
    }
}
module.exports = ITopUpRepository;