const facultyRepo = require('../repositories/faculty');

const create = (req, res) => facultyRepo.create(req.body)
  .then(id => res.send(id));

const findAll = (req, res) => facultyRepo.findAll()
  .then(events => {
    res.send(events);
  });

const findById = (req, res) => facultyRepo.findById(+req.params.id)
  .then(faculty => res.send(faculty));

module.exports = {
  create,
  findAll,
  findById
}
