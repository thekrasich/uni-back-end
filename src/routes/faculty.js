const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { auth, authRole, idParam, validate, errorHandler } = require("./../middleware");

const facultyService = require('../services/faculty');

// POST
router.post('/faculties',
  authRole(2),
  body('name').isLength({ min: 2, max: 256 }),
  body('url').optional().isURL(),
  validate,
  errorHandler(facultyService.create));

// GET
router.get('/faculties',
  errorHandler(facultyService.findAll));

router.get('/faculties/:id',
  idParam,
  validate,
  errorHandler(facultyService.findById));

module.exports = router;
