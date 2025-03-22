const sql = require('mssql');
const ICardsRepository = require('../../Domain/Cards/ICardsRepository');
const sqlConfig = require('../../App/Config/SqlServerConfig');

class CardsRepository extends ICardsRepository{

    async CreateCard(card) {
        try {
            let pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('cc_id', sql.UniqueIdentifier, card.getCc_id())
                .input('b_id', sql.UniqueIdentifier, card.getB_id())
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
}
module.exports = CardsRepository;