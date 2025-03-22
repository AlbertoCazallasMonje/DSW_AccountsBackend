class IAccountsRepository {
    async Create(account){
        throw new Error('Error while creating an account.');
    }

    async FindAccountByDni(dni){
        throw new Error('Error while finding an account by DNI.');
    }
}
module.exports = IAccountsRepository;