const express = require('express');
const router = express.Router();

const { body, query } = require('express-validator');

const { auth, authRole, errorHandler } = require("../middleware");
const eventService = require('../services/event');

router.post('/events', authRole(2),
  body('title').isLength({ min: 5, max: 128 }),
  body('description').isLength({ min: 20, max: 100000 }),
  body('departmentId').isInt().toInt(),
  body('startsAt').isISO8601().toDate(),
  body('endsAt').isISO8601().toDate(),
  errorHandler(eventService.create))

router.get('/events', auth,
  query(['from', 'to']).isISO8601(),
  query(['departments', 'faculties', 'tags']).customSanitizer((value, _) => value.split(',')),
  errorHandler(eventService.findAll));

router.get('/events/:id([1-9][0-9]+|[1-9])', auth, errorHandler(eventService.findById));

module.exports = router;
