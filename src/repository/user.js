const {db} = require("./db");

const createUser = user => {
    return db('users.user').insert({
        role_id: user.roleId,
        full_name: user.fullName,
        email: user.email,
        password_hash: user.passwordHash
    }).returning('id');
}

const findAuthDataByEmail = email => {
    return db('users.user')
        .select([
            'id',
            'role_id as roleId', 
            'full_name as fullName',
            'email', 
            'password_hash as passwordHash',
            'created_at as createdAt'
        ])
        .where({email})
        .first();
}

module.exports = {
    createUser,
    findAuthDataByEmail
}
