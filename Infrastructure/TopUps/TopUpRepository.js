const sql = require('mssql');
const ITopUpRepository = require('../../Domain/TopUps/ITopUpRepository');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const { v4: uuidv4 } = require('uuid');

class TopUpRepository extends ITopUpRepository {

    async AddMoneyToAccount(topUp) {    try {
        let pool = await sql.connect(sqlConfig.config);

        let top_up_id;
        try {
            top_up_id = topUp.getTop_up_id();
        } catch (error) {
            top_up_id = uuidv4();

            topUp._top_up_id = top_up_id;
        }

        const dni = topUp.getU_dni();
        const amount = topUp.getAmount();

        await pool.request()
            .input('top_up_id', sql.UniqueIdentifier, top_up_id)
            .input('u_dni', sql.NVarChar(9), dni)
            .input('amount', sql.Decimal(18,2), amount)
            .query(`
                INSERT INTO top_ups (top_up_id, u_dni, amount)
                VALUES (@top_up_id, @u_dni, @amount)
            `);
        await pool.close();
    } catch (err) {
        console.error('SQL error in AddMoneyToAccount', err);
        throw err;
    }
    }

}
module.exports = TopUpRepository;