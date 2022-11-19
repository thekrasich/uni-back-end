const pg = require('pg');
const Knex = require('knex');

const dbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres47',
    database: 'university_events'
}

const PgDbConnectionPool = pg.Pool;

const dbConnectionPool = new PgDbConnectionPool(dbConfig);
const dbClient = new Knex({
    client: 'pg',
    connection: 'postgres://postgres:postgres47@localhost:5432/university_events'
})

module.exports = {
    dbConnectionPool,
    dbClient
};
