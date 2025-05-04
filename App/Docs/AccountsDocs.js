/**
 * @swagger
 * tags:
 *   - name: Cards
 *     description: Endpoints related to card management (Backend 3002)
 *   - name: Accounts
 *     description: Endpoints related to account management (Backend 3002)
 *   - name: TopUps
 *     description: Endpoints related to top-up management (Backend 3002)
 */

/**
 * @swagger
 * /createCard:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card created successfully"
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /validateCard:
 *   get:
 *     summary: Validate a card's details
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       description: Card validation data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               card:
 *                 type: object
 *                 properties:
 *                   cc_number:
 *                     type: string
 *                     example: "9449685554382515"
 *                   cc_expirationDate:
 *                     type: string
 *                     example: "2028-03-02"
 *                   cc_cvv:
 *                     type: string
 *                     example: "290"
 *     responses:
 *       200:
 *         description: Card validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid card details or tokens
 */

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 example: "12345678A"
 *               country:
 *                 type: string
 *                 example: "US"
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created successfully"
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /find:
 *   get:
 *     summary: Retrieve an account by DNI
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       description: DNI to search for the account
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 example: "12345678A"
 *     responses:
 *       200:
 *         description: Account found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account:
 *                   type: object
 *       404:
 *         description: Account not found
 */

/**
 * @swagger
 * /topUp:
 *   post:
 *     summary: Add a top-up to an account
 *     tags: [TopUps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               quantity:
 *                 type: number
 *                 example: 20.0
 *     responses:
 *       200:
 *         description: Top-up added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Top-up added successfully"
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Endpoints related to transaction management (Backend 3002)
 *   - name: POS
 *     description: Endpoints related to POS order management (Backend 3002)
 */

/**
 * @swagger
 * /searchCards:
 *   post:
 *     summary: Search cards for the authenticated user
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *     responses:
 *       200:
 *         description: List of cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cc_number:
 *                     type: string
 *                   cc_expirationDate:
 *                     type: string
 *                   cc_cvv:
 *                     type: string
 *       400:
 *         description: Invalid tokens or error in request
 */

/**
 * @swagger
 * /performTransaction:
 *   post:
 *     summary: Perform a money transaction to another user
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               email:
 *                 type: string
 *                 example: "recipient@example.com"
 *               amount:
 *                 type: number
 *                 example: 50.0
 *               paymentMethod:
 *                 type: string
 *                 example: "balance"
 *     responses:
 *       200:
 *         description: Transaction completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction added successfully"
 *                 transactionId:
 *                   type: string
 *                   example: "tx12345"
 *                 newBalance:
 *                   type: number
 *                   example: 950.0
 *       400:
 *         description: Invalid tokens, insufficient funds, or request error
 */

/**
 * @swagger
 * /requestMoney:
 *   post:
 *     summary: Request money from another user
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               email:
 *                 type: string
 *                 example: "otheruser@example.com"
 *               amount:
 *                 type: number
 *                 example: 30.0
 *               message:
 *                 type: string
 *                 example: "Dinner share"
 *     responses:
 *       200:
 *         description: Money request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction added successfully"
 *                 transactionId:
 *                   type: string
 *                   example: "req12345"
 *       400:
 *         description: Invalid tokens or request data
 */

/**
 * @swagger
 * /resolveRequest:
 *   post:
 *     summary: Resolve a pending money request
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               transactionId:
 *                 type: string
 *                 example: "req12345"
 *               resolution:
 *                 type: string
 *                 example: "approve"
 *     responses:
 *       200:
 *         description: Request resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction resolved successfully"
 *       400:
 *         description: Invalid tokens or resolution error
 */

/**
 * @swagger
 * /loadPendingTransactions:
 *   post:
 *     summary: Load all pending transactions for the user
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *     responses:
 *       200:
 *         description: Pending transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid tokens or error loading transactions
 */

/**
 * @swagger
 * /adminLoadTransactionDetails:
 *   post:
 *     summary: Load all transactions (admin only)
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *     responses:
 *       200:
 *         description: All transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid tokens or insufficient permissions
 *       404:
 *         description: No transactions found
 */

/**
 * @swagger
 * /performBulkTransaction:
 *   post:
 *     summary: Perform a split (bulk) transaction among multiple users
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["a@example.com","b@example.com"]
 *               amount:
 *                 type: number
 *                 example: 100.0
 *     responses:
 *       200:
 *         description: Split transactions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Split transactions created successfully"
 *       400:
 *         description: Invalid tokens or request data
 */

/**
 * @swagger
 * /loadSplitTransactions:
 *   post:
 *     summary: Load all split transactions for the user
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 example: "session-token-here"
 *               actionToken:
 *                 type: string
 *                 example: "action-token-here"
 *     responses:
 *       200:
 *         description: Split transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 splits:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid tokens or error loading splits
 */

/**
 * @swagger
 * /createPosOrder:
 *   post:
 *     summary: Create a new POS order
 *     tags: [POS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *               actionToken:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: POS order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pos_id:
 *                   type: string
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Invalid tokens or request data
 */

/**
 * @swagger
 * /payPosOrder:
 *   post:
 *     summary: Pay an existing POS order
 *     tags: [POS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *               actionToken:
 *                 type: string
 *               orderId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: POS order paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transactionId:
 *                   type: string
 *                 method:
 *                   type: string
 *       400:
 *         description: Invalid tokens or payment error
 */

/**
 * @swagger
 * /listPosOrders:
 *   post:
 *     summary: List POS orders for the merchant
 *     tags: [POS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *               actionToken:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: "pending"
 *     responses:
 *       200:
 *         description: POS orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid tokens or error loading orders
 */
