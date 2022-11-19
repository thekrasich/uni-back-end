const authRouter = require('./auth');
const eventsRouter = require('./event');

const API_ROOT_URI = '/api';

const initRouters = app => {
    app.use(API_ROOT_URI, authRouter, eventsRouter);
}

module.exports = {
    initRouters
}
