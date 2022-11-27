const userRepo = require('./../repositories/user');
const bcrypt = require('bcrypt');
const { sign } = require('../middleware');

const salt = bcrypt.genSaltSync(10);

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userRepo.findAuthDataByEmail(email);

  const isMatch = bcrypt.compareSync(password, user.passwordHash);

  if (isMatch) {
    res.send({ token: sign({ userId: user.id, roleId: user.roleId }) });
  } else {
    res.status(401).send({ errorMessage: 'Unauthorized' });
  }
}

const signUp = async (req, res) => {
  const user = req.body;

  user.passwordHash = bcrypt.hashSync(user.password, salt);

  try {
    const [{ id }] = await userRepo.create(user);

    res.status(201).send({
      id,
      roleId: user.roleId,
      fullName: user.fullName,
      email: user.email
    });
  } catch (e) {
    res.status(409).send({ errorMessage: "User with such email already exists" });
  }
}

module.exports = {
  signIn,
  signUp
}