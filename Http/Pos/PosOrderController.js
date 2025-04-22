const CommonController = require('../Common/CommonController');
const AccountRepository = require('../../Infrastructure/Accounts/AccountsRepository');
const PosOrdersRepository = require('../../Infrastructure/Pos/PosOrderRepository');
const CreatePosOrder = require('../../Application/Pos/Creator/CreatePosOrder');
const PayPosOrder = require('../../Application/Pos/Payment/PayPosOrder');
const ListPosOrders = require('../../Application/Pos/Searcher/ListPosOrders');
const TransactionCreator = require('../../Application/Transactions/Creator/TransactionCreator');
const TransactionsRepository = require("../../Infrastructure/Transactions/TransactionsRepository");

class PosOrderController {

    async CreateOrder(req, res) {
        try {
            const common = new CommonController();
            const {sessionToken, actionToken, amount, description, expiresAt} = req.body;


            const vs = await common.ValidateSession(sessionToken);
            if (!vs.success) throw new Error(vs.error);

            const rt = await common.RequestToken(sessionToken, 'FIND-USER');
            if (!rt.success) throw new Error(rt.error);
            const fu = await common.FindUser(sessionToken, rt.data.actionToken);
            if (!fu.success) throw new Error(fu.error);
            if (fu.is_admin) return res.status(403).json({error: 'Admin cannot create a POS order'});
            const merchantDni = fu.dni;

            const at = await common.ValidateActionToken(sessionToken, actionToken, 'CREATE-POS-ORDER');
            if (!at.success) throw new Error(at.error);

            const accountRepo = new AccountRepository();
            const posRepo = new PosOrdersRepository();
            const creator = new CreatePosOrder(posRepo, accountRepo);
            const {pos_id, clientSecret} = await creator.Execute(merchantDni, amount, description, new Date(expiresAt));

            return res.status(201).json({pos_id, clientSecret});
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    }

    async PayOrder(req, res) {
        try {
            const common        = new CommonController();
            const { sessionToken, actionToken, orderId, paymentMethodId } = req.body;

            const vs = await common.ValidateSession(sessionToken);
            if (!vs.success) throw new Error(vs.error);

            const rt = await common.RequestToken(sessionToken, 'FIND-USER');
            if (!rt.success) throw new Error(rt.error);
            const fu = await common.FindUser(sessionToken, rt.data.actionToken);
            if (!fu.success) throw new Error(fu.error);
            const buyerDni = fu.dni;

            const at = await common.ValidateActionToken(sessionToken, actionToken, 'PAY-POS-ORDER');
            if (!at.success) throw new Error(at.error);

            const posRepo = new PosOrdersRepository();
            const txRepo  = new TransactionsRepository();
            const accRepo = new AccountRepository();

            const payer = new PayPosOrder(posRepo, txRepo, accRepo);
            const { transactionId, method } =
                await payer.Execute(orderId, buyerDni, paymentMethodId);

            return res.status(200).json({
                message:       'POS Order successfully payed',
                transactionId,
                method
            });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async ListOrders(req, res) {
        try {
            const common = new CommonController();
            const {sessionToken, actionToken, status} = req.body;

            const vs = await common.ValidateSession(sessionToken);
            if (!vs.success) throw new Error(vs.error);
            const rt = await common.RequestToken(sessionToken, 'FIND-USER');
            if (!rt.success) throw new Error(rt.error);
            const fu = await common.FindUser(sessionToken, rt.data.actionToken);
            if (!fu.success) throw new Error(fu.error);
            if (fu.is_admin) return res.status(403).json({error: 'Admins does not have POS transactions'});
            const merchantDni = fu.dni;

            const at = await common.ValidateActionToken(sessionToken, actionToken, 'LIST-POS-ORDERS');
            if (!at.success) throw new Error(at.error);

            const posRepo = new PosOrdersRepository();
            const lister = new ListPosOrders(posRepo);
            const orders = await lister.Execute(merchantDni, status || null);

            return res.status(200).json({orders});
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    }
}

module.exports = PosOrderController;