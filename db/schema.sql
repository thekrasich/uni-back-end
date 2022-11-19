DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE events
(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    start_date TIMESTAMP,
    duration INTERVAL
);

CREATE TABLE users
(
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(128)       NOT NULL,
    first_name    VARCHAR(32)        NOT NULL,
    middle_name   VARCHAR(32)        NOT NULL,
    last_name     VARCHAR(32)        NOT NULL,
    email         VARCHAR(32) UNIQUE NOT NULL,
    phone         VARCHAR(16),
    info          TEXT
);
