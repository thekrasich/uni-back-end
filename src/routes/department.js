const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { auth, authRole, idParam, validate, errorHandler } = require("./../middleware");
const departmentService = require('../services/department');

// POST
router.post('/department',
  authRole(2),
  body('facultyId').isInt().toInt(),
  body('name'),
  body('url').optional().isURL(),
  validate,
  errorHandler(departmentService.create));

// GET
router.get('/departments',
  auth,
  errorHandler(departmentService.findAll));

router.get('/departments/:id',
  idParam,
  validate,
  auth,
  errorHandler(departmentService.findById));

module.exports = router;
