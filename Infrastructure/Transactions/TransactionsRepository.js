const sql = require('mssql');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const {v4: uuidv4} = require('uuid');

class TransactionsRepository {

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

        try {
            let pool = await sql.connect(sqlConfig.config);

            const blockCheck = await pool.request()
                .input('blocker', sql.NVarChar(9), receiver_dni)
                .input('blocked', sql.NVarChar(9), sender_dni)
                .query(`
                    SELECT 1
                    FROM blocked
                    WHERE blocker_dni = @blocker
                      AND blocked_dni = @blocked
                `);

            if (blockCheck.recordset.length > 0) {
                throw new Error('No puedes crear esta transacción: el usuario te ha bloqueado.');
            }

            await pool.request()
                .input('t_id', sql.UniqueIdentifier, newTransaction.t_id)
                .input('dni_sender', sql.NVarChar(9), newTransaction.dni_sender)
                .input('dni_receiver', sql.NVarChar(9), newTransaction.dni_receiver)
                .input('t_message', sql.NVarChar(200), newTransaction.t_message)
                .input('amount', sql.Decimal(18, 2), newTransaction.amount)
                .input('t_state', sql.NVarChar(8), newTransaction.t_state)
                .input('t_date', sql.DateTime2, newTransaction.t_date)
                .input('split_group_id', sql.UniqueIdentifier, newTransaction.split_group_id)
                .query(`
                    INSERT INTO transactions (
                        t_id, dni_sender, dni_receiver, t_message,
                        amount, t_state, t_date, split_group_id
                    ) VALUES (
                                 @t_id, @dni_sender, @dni_receiver, @t_message,
                                 @amount, @t_state, @t_date, @split_group_id
                             )
                `);

            if (newTransaction.t_state === 'ACCEPTED'
                && newTransaction.dni_sender !== newTransaction.dni_receiver) {

                await pool.request()
                    .input('u_dni',        sql.NVarChar(9), newTransaction.dni_sender)
                    .input('frequent_dni', sql.NVarChar(9), newTransaction.dni_receiver)
                    .query(`
                        IF EXISTS (
                            SELECT 1 FROM frequent_users
                             WHERE u_dni = @u_dni
                               AND frequent_dni = @frequent_dni
                        )
                        BEGIN
                            UPDATE frequent_users
                               SET interaction_count = interaction_count + 1,
                                   last_updated      = SYSUTCDATETIME()
                             WHERE u_dni = @u_dni
                               AND frequent_dni = @frequent_dni;
                        END
                        ELSE
                        BEGIN
                            INSERT INTO frequent_users
                                (u_dni, frequent_dni, interaction_count, last_updated)
                            VALUES
                                (@u_dni, @frequent_dni, 1, SYSUTCDATETIME());
                        END
                    `);
            }

            await pool.close();
            return newTransaction;
        } catch (error) {
            console.error('Error creando transacción:', error);
            throw error;
        }
    }

    async GetTransactionById(t_id) {
        const query = `
            SELECT *
            FROM transactions
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
        const updateQuery = `
            UPDATE transactions
            SET t_state = @newStatus
            WHERE t_id = @t_id
        `;
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('t_id', sql.UniqueIdentifier, t_id)
                .input('newStatus', sql.NVarChar(8), newStatus)
                .query(updateQuery);

            if (newStatus === 'ACCEPTED') {
                const txnResult = await pool.request()
                    .input('t_id', sql.UniqueIdentifier, t_id)
                    .query(`
                        SELECT dni_sender, dni_receiver
                        FROM transactions
                        WHERE t_id = @t_id
                    `);

                if (txnResult.recordset.length > 0) {
                    const { dni_sender, dni_receiver } = txnResult.recordset[0];

                    const blockCheck = await pool.request()
                        .input('blocker', sql.NVarChar(9), dni_receiver)
                        .input('blocked', sql.NVarChar(9), dni_sender)
                        .query(`
                            SELECT 1
                            FROM blocked
                            WHERE blocker_dni = @blocker
                              AND blocked_dni = @blocked
                        `);

                    if (blockCheck.recordset.length > 0) {
                        throw new Error('No puedes aceptar esta transacción: el usuario te ha bloqueado.');
                    }

                    if (dni_sender !== dni_receiver) {
                        await pool.request()
                            .input('u_dni',        sql.NVarChar(9), dni_sender)
                            .input('frequent_dni', sql.NVarChar(9), dni_receiver)
                            .query(`
                                IF EXISTS (
                                    SELECT 1 FROM frequent_users
                                     WHERE u_dni = @u_dni
                                       AND frequent_dni = @frequent_dni
                                )
                                BEGIN
                                    UPDATE frequent_users
                                       SET interaction_count = interaction_count + 1,
                                           last_updated      = SYSUTCDATETIME()
                                     WHERE u_dni = @u_dni
                                       AND frequent_dni = @frequent_dni;
                                END
                                ELSE
                                BEGIN
                                    INSERT INTO frequent_users
                                        (u_dni, frequent_dni, interaction_count, last_updated)
                                    VALUES
                                        (@u_dni, @frequent_dni, 1, SYSUTCDATETIME());
                                END
                            `);
                    }
                }
            }

            await pool.close();
            console.log(`Transaction ${t_id} updated to ${newStatus}`);
            return true;
        } catch (error) {
            console.error('Error updating transaction status:', error);
            throw error;
        }
    }
    async GetPendingTransactionsBySender(dni) {
        const query = `
            SELECT
                t.t_id,
                t.amount,
                t.t_message,
                t.t_state,
                t.t_date,
                u.u_name AS senderName
            FROM transactions t
                     INNER JOIN users u
                                ON t.dni_sender = u.u_dni
            WHERE t.dni_receiver = @dni
              AND t.t_state = 'PENDING'
            ORDER BY t.t_date DESC
        `;
        try {
            const pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('dni', sql.NVarChar(9), dni)
                .query(query);
            await pool.close();
            return result.recordset.map(r => ({
                t_id:       r.t_id,
                amount:     r.amount,
                t_message:  r.t_message,
                t_state:    r.t_state,
                t_date:     r.t_date,
                senderName: r.senderName
            }));
        } catch (error) {
            console.error("Error fetching pending transactions with senderName:", error);
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
            SELECT *
            FROM transactions
            WHERE split_group_id = @split_group_id
        `;
        let pool = await sql.connect(sqlConfig.config);
        const result = await pool.request()
            .input('split_group_id', sql.UniqueIdentifier, splitGroupId)
            .query(query);
        await pool.close();
        return result.recordset;
    }

    async GetSplitTransactionsByReceiver({ dni }) {
        const query = `
            SELECT
                t.t_id,
                t.amount,
                t.t_message,
                t.t_state,
                t.t_date,
                t.split_group_id,
                u.u_name AS senderName
            FROM transactions t
                     INNER JOIN users u
                                ON t.dni_sender = u.u_dni
            WHERE t.dni_receiver = @dni
              AND t.split_group_id IS NOT NULL
            ORDER BY t.t_date DESC
        `;
        try {
            const pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('dni', sql.NVarChar(9), dni)
                .query(query);
            await pool.close();
            return result.recordset.map(r => ({
                t_id:         r.t_id,
                amount:       r.amount,
                t_message:    r.t_message,
                t_state:      r.t_state,
                t_date:       r.t_date,
                split_group_id: r.split_group_id,
                senderName:   r.senderName
            }));
        } catch (error) {
            console.error('Error fetching split transactions with senderName:', error);
            throw error;
        }
    }

}

module.exports = TransactionsRepository;