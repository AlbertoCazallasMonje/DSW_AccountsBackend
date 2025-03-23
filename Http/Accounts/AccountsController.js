const AccountCreator = require('../../Application/Accounts/Creator/AccountCreator');
const AccountRepository = require('../../Infrastructure/Accounts/AccountsRepository');
const AccountFinder = require("../../Application/Accounts/Finder/AccountFinder");

class AccountsController {

    async CreateAccount(req, res) {
        try {
            const accountRepository = new AccountRepository();
            const accountsCreator = new AccountCreator(accountRepository);
            await accountsCreator.Execute(req.body);
            res.status(201).json({message: 'Account created successfully'});
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

    async FindAccountByDni(req, res) {
        try {
            const accountRepository = new AccountRepository();
            const accountFinder = new AccountFinder(accountRepository);
            const account = await accountFinder.Execute(req.body);
            res.status(200).json(account);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}
module.exports = AccountsController;