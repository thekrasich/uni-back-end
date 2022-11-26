const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { auth, authRole, errorHandler } = require("../middleware");
const departmentService = require('../services/department');

router.post('/department',
  authRole(2),
  body('facultyId').isInt().toInt(),
  body('name'),
  errorHandler(departmentService.create)
);

router.get('/departments', auth, errorHandler(departmentService.findAll));
router.get('/departments/:id([1-9][0-9]+|[1-9])', auth, errorHandler(departmentService.findById));

module.exports = router;
