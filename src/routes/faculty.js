const express = require('express');
const router = express.Router();

const errorHandler = require("./error-handler");

const facultyService = require('../service/faculty');

router.get('/faculties', errorHandler(facultyService.findAll));

module.exports = router;
