class IAccountsRepository {
    async Create(account){
        throw new Error('Error while creating an account.');
    }

    async FindAccountByDni(dni){
        throw new Error('Error while finding an account by DNI.');
    }

    async UpdateBalance(accountId, quantity){
        throw new Error('Error while updating an account.');
    }
}
module.exports = IAccountsRepository;