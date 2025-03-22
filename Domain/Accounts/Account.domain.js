const Account = require("./Account");

class AccountDomain {
    static Create({ b_id, b_country, b_IBAN, u_dni, b_balance = 0.00 }) {
        return new Account({ b_id, b_country, b_IBAN, u_dni, b_balance });
    }
}

module.exports = AccountDomain;