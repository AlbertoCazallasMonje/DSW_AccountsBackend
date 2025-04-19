const Transaction = require("./Transaction");

class TransactionDomain {
    static Create({
                      t_id,
                      dni_sender,
                      dni_receiver,
                      t_message,
                      amount,
                      t_state = 'PENDING',
                      t_date = new Date(),
                      split_group_id = null
                  }) {
        return new Transaction({
            t_id,
            dni_sender,
            dni_receiver,
            t_message,
            amount,
            t_state,
            t_date,
            split_group_id
        });
    }
}

module.exports = TransactionDomain;
