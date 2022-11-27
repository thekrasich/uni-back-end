const express = require('express');
const router = express.Router();
const { body, oneOf } = require('express-validator');

const { errorHandler } = require("./../middleware");
const { auth, authRole, validate, idParam } = require("../middleware");
const tagService = require('../services/tag');

// validators & sanitizers
const name = body('name').isLength({ min: 2, max: 64 });
const color = body('color').isHexColor();

// POST
router.post('/tags',
  name,
  color,
  validate,
  authRole(2),
  errorHandler(tagService.create));

// PUT
router.put('/tags/:id',
  idParam,
  validate,
  authRole(2),
  oneOf([name, color]));

// GET
router.get('/tags/:id',
  idParam,
  validate,
  auth,
  errorHandler(tagService.findById));

router.get('/tags',
  auth,
  errorHandler(tagService.findAll));

module.exports = router;
