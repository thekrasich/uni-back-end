const express = require('express');
const router = express.Router();

const {body} = require('express-validator');

const errorHandler = require("./error-handler");

const {authorizeUser} = require("../service/auth");
const tagService = require('../service/tag');

// router.post('/department', authorizeUser,
//     body('title').isLength({min: 10, max: 128}),
//     body('content').isLength({min: 20, max: 100000}),
//     body('startDate').custom((value, {req}) => {
//         const event = req.body;
//         const startDate = new Date(event.startDate);

//         if (isNaN(startDate)) {
//             return false;
//         }

//         event.startDate = startDate;

//         return true;
//     }),
//     errorHandler(eventService.create))

// router.get('/tags', errorHandler(tagService.findAll));
router.get('/tags/:id([1-9][0-9]+|[1-9])', errorHandler(tagService.findById));
router.get('/tags', errorHandler(tagService.findAll))

module.exports = router;
