const {db} = require("./db");

const createUser = user => {
    return db('users').insert({
        username: user.username,
        password_hash: user.passwordHash,
        first_name: user.firstName,
        middle_name: user.middleName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone,
        info : user.info
    }).returning('id');
}

const findAuthDataByUserName = username => {
    return db('users')
        .select(['id', 'email', 'password_hash as passwordHash'])
        .where({username})
        .first();
}

module.exports = {
    createUser,
    findAuthDataByUserName
}
