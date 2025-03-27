const config = require('../App/Config/Config');
const express = require('express');
const swaggerDocs = require("../App/Docs/SwaggerDocs");
const swaggerUi = require("swagger-ui-express");
const app = express();
const router = express.Router();
const CommonController = require('./Common/CommonController');
const commonController = new CommonController();
const AccountsController = require('./Accounts/AccountsController');
const accountsController = new AccountsController();
const CardsController = require('./Cards/CardsController');
const cardsController = new CardsController();
const TopUpsController = require('./TopUps/TopUpsController');
const topUpsController = new TopUpsController();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(router);

// Swagger endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes for each use case
// Common


// Accounts
router.post('/create', accountsController.CreateAccount.bind(accountsController));
router.post('/find', accountsController.FindAccountByDni.bind(accountsController));
// Cards
router.post('/createCard', cardsController.CreateCard.bind(cardsController));
router.get('/validateCard', cardsController.ValidateCard.bind(cardsController))
// TopUps
router.post('/topUp', topUpsController.AddMoneyToAccount.bind(topUpsController));

// Initialize Server
const port = config.server.port;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.timeout = 0;