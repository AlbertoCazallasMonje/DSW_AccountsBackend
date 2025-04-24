const sql = require('mssql');
const sqlConfig = require('../../App/Config/SqlServerConfig');
const { v4: uuidv4 } = require('uuid');
const IPosOrderRepository = require("../../Domain/Pos/IPosOrderRepository");

class PosOrderRepository extends  IPosOrderRepository {

    async CreateOrder(order) {
        const pos_id = order.getPosId() || uuidv4();
        const newOrder = {
            pos_id,
            merchant_dni: order.getMerchantDni(),
            amount: order.getAmount(),
            description: order.getDescription(),
            created_at: order.getCreatedAt(),
            expires_at: order.getExpiresAt(),
            transaction_id: order.getTransactionId(),
            payment_provider: order.getPaymentProvider(),
            provider_reference: order.getProviderReference(),
            completed_at: order.getCompletedAt()
        };
        const query = `
            INSERT INTO pos_orders
              (pos_id, merchant_dni, amount, description, created_at,
               expires_at, transaction_id, payment_provider, provider_reference, completed_at)
            VALUES
              (@pos_id, @merchant_dni, @amount, @description, @created_at,
               @expires_at, @transaction_id, @payment_provider, @provider_reference, @completed_at)
        `;
        try {
            const pool = await sql.connect(sqlConfig.config);
            await pool.request()
                .input('pos_id', sql.UniqueIdentifier, newOrder.pos_id)
                .input('merchant_dni', sql.NVarChar(9), newOrder.merchant_dni)
                .input('amount', sql.Decimal(18,2), newOrder.amount)
                .input('description', sql.NVarChar(200), newOrder.description)
                .input('created_at', sql.DateTime2, newOrder.created_at)
                .input('expires_at', sql.DateTime2, newOrder.expires_at)
                .input('transaction_id', sql.UniqueIdentifier, newOrder.transaction_id)
                .input('payment_provider', sql.VarChar(20), newOrder.payment_provider)
                .input('provider_reference', sql.NVarChar(255), newOrder.provider_reference)
                .input('completed_at', sql.DateTime2, newOrder.completed_at)
                .query(query);
            await pool.close();
            return newOrder;
        } catch (error) {
            console.error('Error creando orden POS:', error);
            throw error;
        }
    }

    async GetOrderById(pos_id) {
        const query = `
            SELECT *
            FROM pos_orders
            WHERE pos_id = @pos_id
        `;
        try {
            const pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('pos_id', sql.UniqueIdentifier, pos_id)
                .query(query);
            await pool.close();
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error fetching POS order by ID:', error);
            throw error;
        }
    }

    async GetOrdersByMerchant(merchant_dni, status = null) {
        let query = `
            SELECT *
            FROM pos_orders
            WHERE merchant_dni = @merchant_dni
        `;
        if (status) {
            query += ` AND status = @status`;
        }
        try {
            const pool = await sql.connect(sqlConfig.config);
            const request = pool.request()
                .input('merchant_dni', sql.NVarChar(9), merchant_dni);
            if (status) request.input('status', sql.VarChar(10), status);
            const result = await request.query(query);
            await pool.close();
            return result.recordset;
        } catch (error) {
            console.error('Error fetching POS orders for merchant:', error);
            throw error;
        }
    }

    async UpdateOrderStatus(pos_id, transaction_id, completedAt) {
        const query = `
            UPDATE pos_orders
            SET transaction_id   = @transaction_id,
                completed_at     = @completed_at
            WHERE pos_id = @pos_id
        `;
        const pool = await sql.connect(sqlConfig.config);
        await pool.request()
            .input('transaction_id', sql.UniqueIdentifier, transaction_id)
            .input('completed_at',   sql.DateTime2,      completedAt)
            .input('pos_id',         sql.UniqueIdentifier, pos_id)
            .query(query);
        await pool.close();
        return true;
    }

    async GetExpiredPendingOrders() {
        const query = `
            SELECT *
            FROM pos_orders
            WHERE status = 'PENDING'
              AND expires_at < SYSUTCDATETIME()
        `;
        try {
            const pool = await sql.connect(sqlConfig.config);
            const result = await pool.request().query(query);
            await pool.close();
            return result.recordset;
        } catch (error) {
            console.error('Error fetching expired POS orders:', error);
            throw error;
        }
    }
    async GetOrderByProviderReference(providerReference) {
        const query = `
      SELECT *
      FROM pos_orders
      WHERE provider_reference = @provider_reference
    `;

        try {
            const pool = await sql.connect(sqlConfig.config);
            const result = await pool.request()
                .input('provider_reference', sql.NVarChar(255), providerReference)
                .query(query);
            await pool.close();
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error fetching POS order by provider_reference:', error);
            throw error;
        }
    }
}

module.exports = PosOrderRepository;
