const express = require('express');
const router = express.Router();

const {body} = require('express-validator');

const errorHandler = require("./error-handler");

const {authorizeUser} = require("../service/auth");
const eventService = require('../service/event');

router.post('/events', authorizeUser,
    body('title').isLength({min: 10, max: 128}),
    body('description').isLength({min: 20, max: 100000}),
    body('departmentId').isInt().toInt(),
    body('startsAt').isISO8601().toDate(),
    body('endsAt').isISO8601().toDate(),
    errorHandler(eventService.create))

router.get('/events', errorHandler(eventService.findAll));
router.get('/events/:id([1-9][0-9]+|[1-9])', errorHandler(eventService.findById));

module.exports = router;
