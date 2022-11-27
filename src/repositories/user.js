const { db } = require("./db");

const create = ({ roleId, fullName, email, passwordHash }) => db('users.user')
  .insert({
    role_id: roleId,
    full_name: fullName,
    email,
    password_hash: passwordHash })
  .returning('id');

const findAuthDataByEmail = email => db('users.user')
    .select(['id', 'password_hash as passwordHash'])
    .where({ email })
    .first();

module.exports = {
  create,
  findAuthDataByEmail
}
