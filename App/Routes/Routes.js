const express = require('express');
const router = express.Router();

// Routes for each use case

// Accounts
const {AccountCreator} = require('../../Application/Accounts/Creator/AccountCreator');

// Establish the route for each use case
// Accounts
router.post('/create', AccountCreator);