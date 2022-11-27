const express = require('express');
const router = express.Router();

const { body, query, oneOf } = require('express-validator');

const { auth, authRole, validate, idParam, errorHandler } = require("./../middleware");
const eventService = require('../services/event');

// validators & sanitizers
const title = body('title')
const description = body('description')
const departmentId = body('departmentId').isInt({ min: 1 }).toInt();
const startsAt = body(['startsAt']).isISO8601().toDate();
const endsAt = body(['endsAt']).isISO8601().toDate();
const tags = body('tags.*').isInt({min: 1}).toInt();

// POST
router.post('/events',
  title,
  description,
  departmentId,
  startsAt,
  endsAt,
  tags,
  validate,
  authRole(2),
  errorHandler(eventService.create));

// PUT
router.put('/events/:id',
  idParam,
  oneOf([
    title,
    description,
    departmentId,
    startsAt,
    endsAt,
    tags
  ]),
  validate,
  authRole(2),
  eventService.onlyEventCreator('edit'),
  errorHandler(eventService.update));

// DELETE
router.delete('/events/:id',
  idParam,
  validate,
  authRole(2),
  eventService.onlyEventCreator('delete'),
  errorHandler(eventService.remove));

// GET
router.get('/events',
  query(['from', 'to']).optional().isISO8601(),
  query(['departments', 'faculties', 'tags']).optional().customSanitizer((value, _) => value.split(',')),
  validate,
  auth,
  errorHandler(eventService.findAll));

router.get('/events/:id',
  idParam,
  validate,
  auth,
  errorHandler(eventService.findById));

router.get('/events/:id/tags',
  idParam,
  validate,
  auth,
  errorHandler(eventService.findTagsByEventId));

module.exports = router;
