class Transaction {
    constructor({ t_id, dni_sender, dni_receiver, t_message, amount, t_state = 'PENDING', t_date = new Date() }) {
        this.setT_id(t_id);
        this.setDni_sender(dni_sender);
        this.setDni_receiver(dni_receiver);
        this.setT_message(t_message);
        this.setAmount(amount);
        this.setT_state(t_state);
        this.setT_date(t_date);
    }

    // Getters
    getT_id() {
        return this._t_id;
    }

    getDni_sender() {
        return this._dni_sender;
    }

    getDni_receiver() {
        return this._dni_receiver;
    }

    getT_message() {
        return this._t_message;
    }

    getAmount() {
        return this._amount;
    }

    getT_state() {
        return this._t_state;
    }

    getT_date() {
        return this._t_date;
    }

    // Setters
    setT_id(t_id) {
        if (!t_id) {
            throw new Error("t_id is required");
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(t_id)) {
            throw new Error("t_id must be a valid GUID");
        }
        this._t_id = t_id;
    }

    setDni_sender(dni_sender) {
        if (!dni_sender) {
            throw new Error("dni_sender is required");
        }
        if (typeof dni_sender !== "string" || dni_sender.length > 9) {
            throw new Error("dni_sender must be a string with a maximum length of 9 characters");
        }
        this._dni_sender = dni_sender;
    }

    setDni_receiver(dni_receiver) {
        if (!dni_receiver) {
            throw new Error("dni_receiver is required");
        }
        if (typeof dni_receiver !== "string" || dni_receiver.length > 9) {
            throw new Error("dni_receiver must be a string with a maximum length of 9 characters");
        }
        this._dni_receiver = dni_receiver;
    }

    setT_message(t_message) {
        if (t_message !== undefined && t_message !== null) {
            if (typeof t_message !== "string" || t_message.length > 200) {
                throw new Error("t_message must be a string with a maximum length of 200 characters");
            }
            this._t_message = t_message;
        } else {
            this._t_message = null;
        }
    }

    setAmount(amount) {
        if (amount === undefined || amount === null) {
            throw new Error("amount is required");
        }
        if (typeof amount !== "number") {
            throw new Error("amount must be a number");
        }
        this._amount = parseFloat(amount.toFixed(2));
    }

    setT_state(t_state) {
        if (!t_state) {
            throw new Error("t_state is required");
        }
        const validStates = ['PENDING', 'ACCEPTED', 'DENIED'];
        if (typeof t_state !== "string" || !validStates.includes(t_state)) {
            throw new Error("t_state must be one of 'PENDING', 'ACCEPTED' or 'DENIED'");
        }
        this._t_state = t_state;
    }

    setT_date(t_date) {
        if (!t_date) {
            throw new Error("t_date is required");
        }
        const date = new Date(t_date);
        if (isNaN(date.getTime())) {
            throw new Error("t_date must be a valid date");
        }
        this._t_date = date;
    }
}

module.exports = Transaction;
