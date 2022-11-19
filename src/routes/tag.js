const express = require('express');
const router = express.Router();

const {body} = require('express-validator');

const errorHandler = require("./error-handler");

const {authorizeUser, requireRole} = require("../service/auth");
const tagService = require('../service/tag');

router.post('/tag', authorizeUser, requireRole(2),
    body('name').isLength({min: 3, max: 128}),
    body('color').isHexColor(),
    errorHandler(tagService.create));

router.get('/tags/:id([1-9][0-9]+|[1-9])', authorizeUser, errorHandler(tagService.findById));
router.get('/tags', authorizeUser, errorHandler(tagService.findAll))

module.exports = router;
