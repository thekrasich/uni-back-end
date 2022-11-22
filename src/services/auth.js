const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRepository = require('../repositories/user');

const jwtSecret = 'test';

const AUTH_TOKEN_HEADER = "Authorization";
const TOKEN_PREFIX = "Bearer";

const salt = bcrypt.genSaltSync(10);

const authorizeUser = (req, res, next) => {
    const authHeader = req.header(AUTH_TOKEN_HEADER);

    if (!authHeader) {
        res.status(401).send({errorMessage: 'Missed Authorization header'});
        return;
    }

    const authHeaderParts = authHeader.split(' ');
    if (authHeaderParts.length != 2 || TOKEN_PREFIX !== authHeaderParts[0]) {
        res.status(401).send({errorMessage: 'Invalid format of Auth header!'});
        return;
    }

    const jwtToken = authHeaderParts[1];

    try {
        jwt.verify(jwtToken, jwtSecret);
    } catch (e) {
        res.status(401).send({errorMessage: 'Invalid Auth token!'});
        return;
    }

    const {userId, roleId} = jwt.decode(jwtToken);

    req.userId = userId;
    req.roleId = roleId;

    next();
}

const requireRole = roleId => (req, res, next) => {
    if(!(req.roleId && req.roleId >= roleId)) {
        res.status(403).send({errorMessage: 'Forbidden for your role'});
        return;
    }
    next();
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await userRepository.findAuthDataByEmail(email);

    const isMatch = bcrypt.compareSync(password, user.passwordHash);

    if (isMatch) {
        res.send({token: jwt.sign({userId: user.id, email: user.email, roleId: user.roleId}, jwtSecret)});
    } else {
        res.status(401).send({errorMessage: 'Unauthorized'});
    }
}

const signUp = async (req, res) => {
    const user = req.body;

    user.passwordHash = bcrypt.hashSync(user.password, salt);

    try {
        const [{id}] = await userRepository.createUser(user);
        user.id = id;

        delete user.password;
        delete user.passwordHash;
    } catch (e) {
        res.status(409).send({errorMessage: `${e}`});
        return;
    }

    res.status(201).send(user);
}

module.exports = {
    authorizeUser,
    requireRole,
    signIn,
    signUp
};
