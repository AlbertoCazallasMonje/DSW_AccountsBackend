class Account {
    constructor({ b_id, b_country, b_IBAN, u_dni, b_balance = 0.00 }) {
        this.setB_id(b_id);
        this.setB_country(b_country);
        this.setB_IBAN(b_IBAN);
        this.setU_dni(u_dni);
        this.setB_balance(b_balance);
    }

    getB_id() {
        return this._b_id;
    }

    getB_country() {
        return this._b_country;
    }

    getB_IBAN() {
        return this._b_IBAN;
    }

    getU_dni() {
        return this._u_dni;
    }

    getB_balance() {
        return this._b_balance;
    }

    setB_id(b_id) {
        if (!b_id) {
            throw new Error("b_id is required");
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(b_id)) {
            throw new Error("b_id must be a valid GUID");
        }
        this._b_id = b_id;
    }


    setB_country(b_country) {
        if (!b_country) {
            throw new Error("b_country is required");
        }
        if (typeof b_country !== "string" || b_country.length !== 2) {
            throw new Error("b_country must be a 2-character code");
        }
        this._b_country = b_country.toUpperCase();
    }

    setB_IBAN(b_IBAN) {
        if (!b_IBAN) {
            throw new Error("b_IBAN is required");
        }
        if (typeof b_IBAN !== "string" || b_IBAN.length > 28) {
            throw new Error("b_IBAN must be a string with a maximum length of 28 characters");
        }
        this._b_IBAN = b_IBAN;
    }

    setU_dni(u_dni) {
        if (!u_dni) {
            throw new Error("u_dni is required");
        }
        if (typeof u_dni !== "string" || u_dni.length > 9) {
            throw new Error("u_dni must be a string with a maximum length of 9 characters");
        }
        this._u_dni = u_dni;
    }

    setB_balance(b_balance) {
        if (typeof b_balance !== "number") {
            throw new Error("b_balance must be a number");
        }
        // Format the balance to two decimals.
        this._b_balance = parseFloat(b_balance.toFixed(2));
    }
}

module.exports = Account;