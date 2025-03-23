const express = require('express');
const router = express.Router();

// Routes for each use case

// Accounts
const {AccountCreator} = require('../../Application/Accounts/Creator/AccountCreator');
const {AccountFinder} = require('../../Application/Accounts/Finder/AccountFinder');

// Cards
const {CardCreator} = require('../../Application/Cards/Creator/CardCreator');
// Establish the route for each use case
// Accounts
router.post('/create', AccountCreator);
router.get('/find', AccountFinder);

// Cards
router.post('/create', CardCreator);