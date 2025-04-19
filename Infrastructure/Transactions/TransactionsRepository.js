const sql = require('mssql');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const { v4: uuidv4 } = require('uuid');

class TransactionsRepository{

    async CreateTransaction(transaction) {
        const {
            sender_dni,
            receiver_dni,
            amount,
            t_message,
            t_state,
            t_date,
            split_group_id = null
        } = transaction;

        const t_id = uuidv4();
        const newTransaction = {
            t_id,
            dni_sender: sender_dni,
            dni_receiver: receiver_dni,
            t_message: t_message || null,
            amount: parseFloat(amount.toFixed(2)),
            t_state,
            t_date: t_date || new Date(),
            split_group_id
        };

        const query = `
            INSERT INTO transactions (
                t_id, dni_sender, dni_receiver, t_message, amount, t_state, t_date, split_group_id
            ) VALUES (
                         @t_id, @dni_sender, @dni_receiver, @t_message,
                         @amount, @t_state, @t_date, @split_group_id
                     )
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
                .input('split_group_id', sql.UniqueIdentifier, newTransaction.split_group_id)
                .query(query);
            await pool.close();
            return newTransaction;
        } catch (error) {
            console.error('Error creando transacción con split_group_id:', error);
            throw error;
        }
    }

    async GetTransactionById(t_id) {
        const query = `
      SELECT * FROM transactions
      WHERE t_id = @t_id
    `;
        try {
            let pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('t_id', sql.UniqueIdentifier, t_id)
                .query(query);
            await pool.close();
            if (result.recordset.length === 0) return null;
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching transaction:", error);
            throw error;
        }
    }

    async UpdateTransactionStatus(t_id, newStatus) {
        const query = `
      UPDATE transactions
      SET t_state = @newStatus
      WHERE t_id = @t_id
    `;
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('t_id', sql.UniqueIdentifier, t_id)
                .input('newStatus', sql.NVarChar(8), newStatus)
                .query(query);
            await pool.close();
            console.log(`Transaction ${t_id} updated to ${newStatus}`);
            return true;
        } catch (error) {
            console.error("Error updating transaction status:", error);
            throw error;
        }
    }

    async GetPendingTransactionsBySender(dni) {
        const query = `
    SELECT * FROM transactions
    WHERE dni_sender = @dni AND t_state = 'PENDING'
  `;
        try {
            let pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('dni', sql.NVarChar(9), dni)
                .query(query);
            await pool.close();
            return result.recordset;
        } catch (error) {
            console.error("Error fetching pending transactions:", error);
            throw error;
        }
    }

    async LoadTransactions() {
        try {
            let pool = await sql.connect(sqlConfig.config);
            let result = await pool.request()
                .query(`
                SELECT t_id, dni_sender, dni_receiver, t_message, amount, t_state, t_date
                FROM transactions
            `);
            await pool.close();
            return result.recordset;
        } catch (err) {
            console.error('SQL error in LoadTransactions', err);
            throw err;
        }
    }

    async GetBySplitGroup(splitGroupId) {
        const query = `
            SELECT * FROM transactions WHERE split_group_id = @split_group_id
        `;
        let pool = await sql.connect(sqlConfig.config);
        const result = await pool.request()
            .input('split_group_id', sql.UniqueIdentifier, splitGroupId)
            .query(query);
        await pool.close();
        return result.recordset;
    }

}
module.exports = TransactionsRepository;