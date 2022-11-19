const {db} = require("./db");

const createEvent = event => db('events').insert({
    title: event.title,
    content: event.content,
    start_date: event.startDate,
    duration: event.duration,
}).returning('id');

const findAll = () => {
    return db('events').select(['id', 'title', 'content', 'start_date as startDate', db.raw('CAST(duration AS VARCHAR)')]);
}

const findById = id => {
    return db('events').select(['id', 'title', 'content', 'start_date as startDate', db.raw('CAST(duration AS VARCHAR)')])
        .where({id})
        .first()
}

module.exports = {
    findAll,
    findById,
    createEvent
}
