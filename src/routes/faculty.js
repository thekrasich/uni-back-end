const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { auth, authRole, idParam, validate, errorHandler } = require("./../middleware");

const facultyService = require('../services/faculty');

// POST
router.post('/faculties',
  body('name'),
  body('url').optional().isURL(),
  validate,
  authRole(2),
  errorHandler(facultyService.create));

// GET
router.get('/faculties',
  auth,
  errorHandler(facultyService.findAll));

router.get('/faculties/:id',
  idParam,
  validate,
  auth,
  errorHandler(facultyService.findById));

module.exports = router;
