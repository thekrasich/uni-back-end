const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const jwtSecret = 'test';

const AUTH_TOKEN_HEADER = "Authorization";
const TOKEN_PREFIX = "Bearer";

// const authRole = (minRequiredRole = 1) => (req, res, next) => {
//   const authHeader = req.header(AUTH_TOKEN_HEADER);
//
//   if (!authHeader) {
//     res.status(401).send({ errorMessage: 'Missed Authorization header' });
//     return;
//   }
//
//   const authHeaderParts = authHeader.split(' ');
//   if (authHeaderParts.length !== 2 || TOKEN_PREFIX !== authHeaderParts[0]) {
//     res.status(401).send({ errorMessage: 'Invalid format of Auth header!' });
//     return;
//   }
//
//   const jwtToken = authHeaderParts[1];
//
//   try {
//     jwt.verify(jwtToken, jwtSecret);
//   } catch (e) {
//     res.status(401).send({ errorMessage: 'Invalid Auth token!' });
//     return;
//   }
//
//   const { userId, roleId } = jwt.decode(jwtToken);
//
//   if (roleId < minRequiredRole) {
//     res.status(403).send({ errorMessage: 'Your role has not enough rights for such request' });
//     return;
//   }
//
//   req.user = { id: userId, roleId };
//
//   next();
// }
//
// const auth = authRole(1);

const auth = (req, res, next) => next();
const authRole = (minRequiredRole) => (req, res, next) => next();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

const errorHandler = routerCallBack => {
  return async (req, res, next) => {
    try {
      await routerCallBack(req, res, next);
    } catch (e) {
      console.log(e);
      res.status(500).send({ errorMessage: `${e}` });
    }
  }
};

module.exports = {
  authRole,
  auth,
  validate,
  errorHandler
};
