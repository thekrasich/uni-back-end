const departmentRepo = require('../repositories/department');

const create = async (req, res) =>
  res.send(await departmentRepo.create(req.body));

const findAll = async (req, res) =>
  res.send({ items: await departmentRepo.findAll() });

const findById = async (req, res) => {
  const event = departmentRepo.findById(req.params.id);
  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ errorMessage: 'Department not found' });
  }
};

module.exports = {
  create,
  findAll,
  findById
}
