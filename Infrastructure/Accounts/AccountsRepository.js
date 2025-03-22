const sql = require('mssql');
const IAccountRepository = require('../../Domain/Accounts/IAccountsRepository');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const AccountsController = require("../../Http/Accounts/AccountsController");

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
}
module.exports = AccountsRepository;