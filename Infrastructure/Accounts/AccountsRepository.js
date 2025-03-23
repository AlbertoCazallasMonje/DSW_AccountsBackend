const sql = require('mssql');
const IAccountRepository = require('../../Domain/Accounts/IAccountsRepository');
const sqlConfig = require('../../App/Config/SqlServerConfig');

class AccountsRepository extends IAccountRepository {
    async Create(account) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('b_id', sql.UniqueIdentifier, account.getB_id())
                .input('b_country', sql.NVarChar(2), account.getB_country())
                .input('b_IBAN', sql.NVarChar(28), account.getB_IBAN())
                .input('u_dni', sql.NVarChar(9), account.getU_dni())
                .input('b_balance', sql.Decimal(18,2), account.getB_balance())
                .query(`
                INSERT INTO bank_accounts (b_id, b_country, b_IBAN, u_dni, b_balance)
                VALUES (@b_id, @b_country, @b_IBAN, @u_dni, @b_balance)
            `);
            await pool.close();
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        }
    }

    async FindAccountByDni({dni}) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            let result = await pool.request()
                .input('u_dni', sql.NVarChar(9), dni)
                .query(`
                SELECT b_id
                FROM bank_accounts
                WHERE u_dni = @u_dni
            `);
            await pool.close();
            if (result.recordset.length === 0) {
                throw new Error("No account found for the provided DNI");
            }

            return result.recordset[0];
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        }
    }

    async UpdateBalance(accountId, quantity) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('accountId', sql.UniqueIdentifier, accountId.b_id)
                .input('quantity', sql.Decimal(18,2), quantity)
                .query(`
                    UPDATE bank_accounts
                    SET b_balance = b_balance + @quantity
                    WHERE b_id = @accountId
                `);
            await pool.close();
        } catch (err) {
            console.error('SQL error in UpdateBalance', err);
            throw err;
        }
    }
}
module.exports = AccountsRepository;