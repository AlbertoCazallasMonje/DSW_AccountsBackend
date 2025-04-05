const Transaction = require("./Transaction");

class TransactionDomain {
    static Create({ t_id, dni_sender, dni_receiver, t_message, amount, t_state = 'PENDING', t_date = new Date() }) {
        return new Transaction({ t_id, dni_sender, dni_receiver, t_message, amount, t_state, t_date });
    }
}

module.exports = TransactionDomain;
