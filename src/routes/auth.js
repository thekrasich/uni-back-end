const express = require('express');
const router = express.Router();

const errorHandler = require("./error-handler");

const authService = require('../services/auth');

router.post('/auth/sign-in', errorHandler(authService.signIn));
router.post('/auth/sign-up', errorHandler(authService.signUp));

module.exports = router;
