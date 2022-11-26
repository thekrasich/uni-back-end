const facultyRepository = require('../repositories/faculty');

const create = (req, res) => facultyRepository.create(req.body)
  .then(id => res.send(id));

const findAll = (req, res) => facultyRepository.findAll()
    .then(events => {
        res.send(events);
    });

const findById = (req, res) => facultyRepository.findById(+req.params.id)
  .then(faculty => res.send(faculty));

module.exports = {
  create,
  findAll,
  findById
}
