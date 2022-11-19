const {dbClient} = require("./db");

const createUser = user => {
    return dbClient('users').insert({
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
    return dbClient('users')
        .select(['id', 'email', 'password_hash'])
        .where({username})
        .first()
        .then(user => {
            if (user) {
                user.passwordHash = user.password_hash;
            }
            return user;
        });
}

module.exports = {
    createUser,
    findAuthDataByUserName
}
