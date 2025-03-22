class Card{
    constructor({ cc_id, b_id, cc_number, cc_expirationDate, cc_cvv }) {
        this.setCc_id(cc_id);
        this.setB_id(b_id);
        this.setCc_number(cc_number);
        this.setCc_expirationDate(cc_expirationDate);
        this.setCc_cvv(cc_cvv);
    }

    getCc_id() {
        return this._cc_id;
    }

    getB_id() {
        return this._b_id;
    }

    getCc_number() {
        return this._cc_number;
    }

    getCc_expirationDate() {
        return this._cc_expirationDate;
    }

    getCc_cvv() {
        return this._cc_cvv;
    }

    setCc_id(cc_id) {
        if (!cc_id) {
            throw new Error("cc_id is required");
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(cc_id)) {
            throw new Error("cc_id must be a valid GUID");
        }
        this._cc_id = cc_id;
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

    setCc_number(cc_number) {
        if (!cc_number) {
            throw new Error("cc_number is required");
        }
        if (typeof cc_number !== "string") {
            throw new Error("cc_number must be a string");
        }
        // Validate that cc_number is exactly 16 digits
        if (cc_number.length !== 16 || !/^\d+$/.test(cc_number)) {
            throw new Error("cc_number must be a 16-digit numeric string");
        }
        this._cc_number = cc_number;
    }

    setCc_expirationDate(cc_expirationDate) {
        if (!cc_expirationDate) {
            throw new Error("cc_expirationDate is required");
        }
        const dateObj = new Date(cc_expirationDate);
        if (isNaN(dateObj.getTime())) {
            throw new Error("cc_expirationDate must be a valid date");
        }
        if (dateObj < new Date()) {
            throw new Error("cc_expirationDate must be in the future");
        }

        this._cc_expirationDate = dateObj;
    }

    setCc_cvv(cc_cvv) {
        if (!cc_cvv) {
            throw new Error("cc_cvv is required");
        }
        if (typeof cc_cvv !== "string") {
            throw new Error("cc_cvv must be a string");
        }
        if (cc_cvv.length !== 3 || !/^\d{3}$/.test(cc_cvv)) {
            throw new Error("cc_cvv must be a 3-digit numeric string");
        }
        this._cc_cvv = cc_cvv;
    }
}
module.exports = Card;