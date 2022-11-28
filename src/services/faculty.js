const facultyRepo = require('../repositories/faculty');

const create = async (req, res) =>
  res.send(await facultyRepo.create(req.body));

const findAll = async (req, res) =>
  res.send(await facultyRepo.findAll());

const findById = async (req, res) =>
  res.send(await facultyRepo.findById(req.params.id));

module.exports = {
  create,
  findAll,
  findById
}
