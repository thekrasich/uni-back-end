const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { auth, authRole, validate, errorHandler } = require("./../middleware");

const facultyService = require('../services/faculty');

router.post('/faculties',
  authRole(2),
  body('name'),
  validate,
  errorHandler(facultyService.create));

router.get('/faculties', auth, errorHandler(facultyService.findAll));
router.get('/faculties/:id([1-9][0-9]+|[1-9])', auth, errorHandler(facultyService.findById));

module.exports = router;
