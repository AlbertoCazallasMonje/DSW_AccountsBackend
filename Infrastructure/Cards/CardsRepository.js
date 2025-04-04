const sql = require('mssql');
const ICardsRepository = require('../../Domain/Cards/ICardsRepository');
const sqlConfig = require('../../App/Config/SqlServerConfig');

class CardsRepository extends ICardsRepository{

    async CreateCard(card) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('cc_id', sql.UniqueIdentifier, card.getCc_id())
                .input('b_id', sql.UniqueIdentifier, card.getB_id()) // Se usa b_id.
                .input('cc_number', sql.VarChar(16), card.getCc_number())
                .input('cc_expirationDate', sql.Date, card.getCc_expirationDate())
                .input('cc_cvv', sql.Char(3), card.getCc_cvv())
                .query(`
                    INSERT INTO credit_cards (cc_id, b_id, cc_number, cc_expirationDate, cc_cvv)
                    VALUES (@cc_id, @b_id, @cc_number, @cc_expirationDate, @cc_cvv)
                `);
            await pool.close();
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        }
    }

    async ValidateCard(card){
        try {
            let pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('cc_id', sql.UniqueIdentifier, card.cc_id)
                .input('b_id', sql.UniqueIdentifier, card.b_id)
                .input('cc_number', sql.VarChar(16), card.cc_number)
                .input('cc_expirationDate', sql.Date, card.cc_expirationDate)
                .input('cc_cvv', sql.Char(3), card.cc_cvv)
                .query(`
                    SELECT * FROM credit_cards
                    WHERE cc_id = @cc_id
                      AND b_id = @b_id
                      AND cc_number = @cc_number
                      AND cc_expirationDate = @cc_expirationDate
                      AND cc_cvv = @cc_cvv
                `);
            await pool.close();
            const exists = result.recordset && result.recordset.length > 0;
            return exists;
        } catch (err) {
            console.error('SQL error in exists', err);
            throw err;
        }
    }
    async SearchCards(b_id) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('b_id', sql.UniqueIdentifier, b_id)
                .query(`
                SELECT cc_id, b_id, cc_number, cc_expirationDate, cc_cvv
                FROM credit_cards
                WHERE b_id = @b_id
            `);
            await pool.close();
            return result.recordset;
        } catch (err) {
            if (pool) await pool.close();
            throw err;
        }
    }
}
module.exports = CardsRepository;