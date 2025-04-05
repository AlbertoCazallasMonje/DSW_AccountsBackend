const CommonController = require("../Common/CommonController");
const AccountRepository = require("../../Infrastructure/Accounts/AccountsRepository");
const TransactionsRepository = require("../../Infrastructure/Transactions/TransactionsRepository");
const TransactionCreator = require("../../Application/Transactions/Creator/TransactionCreator");

class TransactionController{
    async PerformTransaction(req, res) {
        try{
            const commonController = new CommonController();
            const { sessionToken, actionToken, email, amount} = req.body;

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

            const sender_dni = findUserResponse.dni;

            const findReceiverTokenResponse = await commonController.RequestToken(sessionToken, 'FIND-USER');
            if (!findUserTokenResponse.success) {
                throw new Error(findUserTokenResponse.error || 'Error requesting token');
            }

            const findReceiverToken = findReceiverTokenResponse.data.actionToken;

            const findReceiverResponse = await commonController.FindReceiver(sessionToken, findReceiverToken, email);
            if (!findReceiverResponse.success) {
                throw new Error(findReceiverResponse.error || 'Error finding user');
            }

            const receiver_dni = findReceiverResponse.dni;

            const performTransactionTokenResponse = await commonController.ValidateActionToken(sessionToken, actionToken, 'PERFORM-TRANSACTION');
            if (!performTransactionTokenResponse.success) {
                throw new Error(performTransactionTokenResponse.error || 'Error requesting token');
            }

            const accountRepository = new AccountRepository();
            const transactionRepository = new TransactionsRepository();
            const transactionCreator = new TransactionCreator(transactionRepository, accountRepository);
            await transactionCreator.Execute(sender_dni, receiver_dni, amount);

            res.status(200).json({message: 'Top up added successfully'});
        }catch(err){
            res.status(400).json({error: err.message});
        }
    }
}
module.exports = TransactionController;