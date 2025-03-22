
class AccountFinder {
    constructor(AccountRepository) {
        this._AccountRepository = AccountRepository;
    }

    async Execute(dni) {
        try {
            return await this._AccountRepository.FindAccountByDni(dni);
        } catch (err) {
            console.error('Error while finding an account by DNI.', err);
            throw err;
        }
    }
}
module.exports = AccountFinder;