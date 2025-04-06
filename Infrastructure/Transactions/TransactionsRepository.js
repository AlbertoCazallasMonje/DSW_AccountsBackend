const sql = require('mssql');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const { v4: uuidv4 } = require('uuid');

class TransactionsRepository{

    async CreateTransaction(transaction) {
        const { sender_dni, receiver_dni, amount, t_message, t_state, t_date } = transaction;
        const t_id = uuidv4();

        const newTransaction = {
            t_id: t_id,
            dni_sender: sender_dni,
            dni_receiver: receiver_dni,
            t_message: t_message || null,
            amount: parseFloat(amount.toFixed(2)),
            t_state: t_state,
            t_date: t_date || new Date()
        };

        const query = `
            INSERT INTO transactions (t_id, dni_sender, dni_receiver, t_message, amount, t_state, t_date)
            VALUES (@t_id, @dni_sender, @dni_receiver, @t_message, @amount, @t_state, @t_date)
        `;

        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('t_id', sql.UniqueIdentifier, newTransaction.t_id)
                .input('dni_sender', sql.NVarChar(9), newTransaction.dni_sender)
                .input('dni_receiver', sql.NVarChar(9), newTransaction.dni_receiver)
                .input('t_message', sql.NVarChar(200), newTransaction.t_message)
                .input('amount', sql.Decimal(18,2), newTransaction.amount)
                .input('t_state', sql.NVarChar(8), newTransaction.t_state)
                .input('t_date', sql.DateTime2, newTransaction.t_date)
                .query(query);
            await pool.close();
            console.log("Transaction created in DB:", newTransaction);
            return newTransaction;
        } catch (error) {
            console.error("Error creating transaction:", error);
            throw error;
        }
    }
}
module.exports = TransactionsRepository;