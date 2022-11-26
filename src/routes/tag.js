const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { errorHandler } = require("./../middleware");

const { auth, authRole } = require("../middleware");
const tagService = require('../services/tag');

router.post('/tag', authRole(2),
  body('name').isLength({ min: 3, max: 128 }),
  body('color').isHexColor(),
  errorHandler(tagService.create));

router.get('/tags/:id([1-9][0-9]+|[1-9])', auth, errorHandler(tagService.findById));
router.get('/tags', auth, errorHandler(tagService.findAll))

module.exports = router;
