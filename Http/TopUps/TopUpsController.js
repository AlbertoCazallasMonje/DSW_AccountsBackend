const CommonController = require("../Common/CommonController");
const AccountRepository = require("../../Infrastructure/Accounts/AccountsRepository");
const TopUpRepository = require("../../Infrastructure/TopUps/TopUpRepository");
const TopUpAdder = require("../../Application/TopUps/TopUpAdder/TopUpAdder");

class TopUpsController {

    async AddMoneyToAccount(req, res) {
        try{
            const commonController = new CommonController();
            const { sessionToken, actionToken, quantity } = req.body;

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

            const addMoneyTokenResponse = await commonController.ValidateActionToken(sessionToken, actionToken, 'ADD-TOP-UP');
            if (!addMoneyTokenResponse.success) {
                throw new Error(addMoneyTokenResponse.error || 'Error requesting token');
            }

            const accountRepository = new AccountRepository();
            const topUpRepository = new TopUpRepository();
            const topUpAdder = new TopUpAdder(topUpRepository, accountRepository);
            await topUpAdder.Execute(dni, quantity);

            res.status(200).json({message: 'Top up added successfully'});
        }catch(err){
            res.status(400).json({error: err.message});
        }
    }
}

module.exports = TopUpsController;