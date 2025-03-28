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