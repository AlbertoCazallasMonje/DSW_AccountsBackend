const TopUp = require('../../Domain/TopUps/TopUp');
const { v4: uuidv4 } = require('uuid');
class TopUpDomain {
    static Create({ top_up_id, u_dni, amount, created_at = new Date() }) {
        if (!top_up_id) {
            top_up_id = uuidv4();
        }
        return new TopUp({ top_up_id, u_dni, amount, created_at });
    }
}

module.exports = TopUpDomain;
