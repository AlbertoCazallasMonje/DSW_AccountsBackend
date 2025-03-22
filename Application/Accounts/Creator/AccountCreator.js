const AccountDomain = require("../../../Domain/Accounts/Account.domain");
const {v4: uuidv4} = require('uuid');

class AccountCreator {
    constructor(accountRepository) {
        this._accountRepository = accountRepository;
    }

    async Execute({dni, country}) {
        const b_id = this._generateBId();
        const b_IBAN = this._generateBIBAN();
        const account = AccountDomain.Create({
            b_id,
            b_country: country,
            b_IBAN,
            u_dni: dni,
            b_balance: 0.00
        });
        await this._accountRepository.Create(account);
    }

    _generateBId() {
        return uuidv4();
    }

    _generateBIBAN() {
        const digits = '0123456789';
        let iban = '';
        for (let i = 0; i < 28; i++) {
            iban += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return iban;
    }
}

module.exports = AccountCreator;