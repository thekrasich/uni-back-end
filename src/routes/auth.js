const express = require('express');
const router = express.Router();

const { validate, errorHandler } = require("./../middleware");

const authService = require('../services/auth');
const { body } = require("express-validator");

router.post('/auth/sign-up',
  body('roleId').isInt().toInt(),
  body('fullName'),
  body('email').isEmail(),
  body('password'),
  validate,
  errorHandler(authService.signIn));

router.post('/auth/sign-in',
  body('email').isEmail(),
  body('password'),
  validate,
  errorHandler(authService.signUp));

module.exports = router;
