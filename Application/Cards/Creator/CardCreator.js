const { v4: uuidv4 } = require('uuid');
const CardsDomain = require('../../../Domain/Cards/Card.domain');
class CardCreator {
    constructor(cardRepository, accountRepository) {
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    async Execute({ dni, cc_number, cc_expirationDate, cc_cvv }) {
        try {
            if (!/^\d{16}$/.test(cc_number)) {
                throw new Error('El número de tarjeta debe contener 16 dígitos numéricos.');
            }
            if (!/^\d{3}$/.test(cc_cvv)) {
                throw new Error('El CVV debe contener 3 dígitos numéricos.');
            }

            const expirationDate = new Date(cc_expirationDate);
            if (isNaN(expirationDate.getTime())) {
                throw new Error('La fecha de expiración no es un formato de fecha válido.');
            }
            if (expirationDate <= new Date()) {
                throw new Error('La fecha de expiración debe ser una fecha futura.');
            }

            const account = await this.accountRepository.FindAccountByDni({dni});
            if (!account) {
                throw new Error('No se encontró la cuenta asociada al DNI.');
            }

            const cc_id = uuidv4();
            const card = CardsDomain.Create({
                cc_id,
                b_id: account.b_id,
                cc_number,
                cc_expirationDate: expirationDate,
                cc_cvv
            });

            return await this.cardRepository.CreateCard(card);
        } catch (err) {
            console.error('Error al crear la tarjeta.', err);
            throw err;
        }
    }
}

module.exports = CardCreator;