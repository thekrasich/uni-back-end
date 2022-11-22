const Knex = require('knex');

const db = new Knex({
    client: 'pg',
    connection: process.env.PG_CONN_URL
});

module.exports = {
    db
};
