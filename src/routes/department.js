const express = require('express');
const router = express.Router();

const {body} = require('express-validator');

const errorHandler = require("./error-handler");

const {authorizeUser} = require("../service/auth");
const departmentService = require('../service/department');

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

router.get('/departments', errorHandler(departmentService.findAll));
router.get('/departments/:id([1-9][0-9]+|[1-9])', errorHandler(departmentService.findById));

module.exports = router;
