class IAccountsRepository {
    async Create(account){
        throw new Error('Error while creating an account.');
    }
}
module.exports = IAccountsRepository;