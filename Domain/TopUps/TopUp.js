class TopUp {
    constructor({ top_up_id, u_dni, amount, created_at }) {
        this.setTop_up_id(top_up_id);
        this.setU_dni(u_dni);
        this.setAmount(amount);
        this.setCreated_at(created_at);
    }


    getTop_up_id() {
        return this._top_up_id;
    }

    getU_dni() {
        return this._u_dni;
    }

    getAmount() {
        return this._amount;
    }

    getCreated_at() {
        return this._created_at;
    }


    setTop_up_id(top_up_id) {
        if (!top_up_id) {
            throw new Error("top_up_id is required");
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(top_up_id)) {
            throw new Error("top_up_id must be a valid GUID");
        }
        this._top_up_id = top_up_id;
    }

    setU_dni(u_dni) {
        if (!u_dni) {
            throw new Error("u_dni is required");
        }
        if (typeof u_dni !== "string") {
            throw new Error("u_dni must be a string");
        }

        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        if (!dniRegex.test(u_dni)) {
            throw new Error("u_dni must be a valid Spanish DNI (8 digits followed by a letter)");
        }
        this._u_dni = u_dni;
    }

    setAmount(amount) {
        if (amount === undefined || amount === null) {
            throw new Error("amount is required");
        }
        if (typeof amount !== "number") {
            throw new Error("amount must be a number");
        }

        if (amount <= 0) {
            throw new Error("amount must be greater than 0");
        }
        this._amount = amount;
    }

    setCreated_at(created_at) {
        if (!created_at) {
            throw new Error("created_at is required");
        }
        const dateObj = new Date(created_at);
        if (isNaN(dateObj.getTime())) {
            throw new Error("created_at must be a valid date");
        }
        this._created_at = dateObj;
    }
}

module.exports = TopUp;
