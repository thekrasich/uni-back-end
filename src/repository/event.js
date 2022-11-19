const {dbConnectionPool: db} = require("./db");

const {dbClient} = require("./db");

const createEvent = event => dbClient('events').insert({
    title: event.title,
    content: event.content,
    start_date: event.startDate,
    duration: event.duration,
}).returning('id');

const findAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, title, content, start_date startDate, CAST(duration AS VARCHAR) FROM events', (err, dbRes) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(dbRes.rows);
        });
    });
}

const findById = id => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, title, content, start_date startDate, CAST(duration AS VARCHAR) FROM events WHERE id = $1', [id], (err, dbRes) => {
            if (err) {
                reject(err);
                return;
            }

            const event = dbRes.rows[0];
            if (!event) {
                resolve(null);
            } else {
                resolve(event);
            }
        });
    });
}

module.exports = {
    findAll,
    findById,
    createEvent
}
