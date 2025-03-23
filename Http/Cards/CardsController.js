const CardCreator = require('../../Application/Cards/Creator/CardCreator');
const CardRepository = require('../../Infrastructure/Cards/CardsRepository');
const AccountRepository = require('../../Infrastructure/Accounts/AccountsRepository');
const CommonController = require("../Common/CommonController");

class CardsController {
    async CreateCard(req, res) {
        try {
            const commonController = new CommonController();
            const { sessionToken, actionToken } = req.body;
            const validateSessionResponse = await commonController.ValidateSession(sessionToken);
            if (!validateSessionResponse.success) {
                throw new Error(validateSessionResponse.error || 'Error validating session');
            }

            const findUserTokenResponse = await commonController.RequestToken(sessionToken, 'FIND-USER');
            if (!findUserTokenResponse.success) {
                throw new Error(findUserTokenResponse.error || 'Error requesting token');
            }

            const findUserToken = findUserTokenResponse.data.actionToken;

            const findUserResponse = await commonController.FindUser(sessionToken, findUserToken);
            if (!findUserResponse.success) {
                throw new Error(findUserResponse.error || 'Error finding user');
            }
            const dni = findUserResponse.dni;

            const createCardTokenResponse= await commonController.ValidateActionToken(sessionToken , actionToken, 'CREATE-CARD');
            if (!createCardTokenResponse.success) {
                throw new Error(createCardTokenResponse.error || 'Error validating token');
            }

            const accountRepository = new AccountRepository();
            const cardRepository = new CardRepository();
            const cardCreator = new CardCreator(cardRepository, accountRepository);
            await cardCreator.Execute({dni});

            res.status(201).json({ message: 'Card created successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
module.exports = CardsController;