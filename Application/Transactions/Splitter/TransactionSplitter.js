const { v4: uuidv4 } = require('uuid');

class TransactionSplitter {
    constructor(commonController, accountRepository, transactionRepository) {
        this.commonController = commonController;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    async Execute(sessionToken, receiverDni, emails, amount) {
        if (!Array.isArray(emails) || emails.length === 0) {
            throw new Error('An empty array argument must be an array');
        }
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount');
        }

        const splitAmount = parseFloat((amount / emails.length).toFixed(2));

        await this.accountRepository.FindAccountByDni({ dni: receiverDni });

        const splitGroupId = uuidv4();

        for (const email of emails) {
            const findSenderTokenResp = await this.commonController.RequestToken(sessionToken, 'FIND-USER');
            if (!findSenderTokenResp.success) {
                throw new Error(findSenderTokenResp.error || 'Error requesting FIND-USER token for sender');
            }
            const findSenderToken = findSenderTokenResp.data.actionToken;
            const findSenderResp = await this.commonController.FindByEmail(
                sessionToken,
                findSenderToken,
                email
            );
            if (!findSenderResp.success) {
                throw new Error(findSenderResp.error || `Error finding user by email: ${email}`);
            }
            const senderDni = findSenderResp.dni;

            await this.accountRepository.FindAccountByDni({ dni: senderDni });

            const transaction = {
                sender_dni: senderDni,
                receiver_dni: receiverDni,
                amount: splitAmount,
                t_state: 'PENDING',
                t_date: new Date(),
                split_group_id: splitGroupId
            };

            await this.transactionRepository.CreateTransaction(transaction);
        }
    }
}

module.exports = TransactionSplitter;