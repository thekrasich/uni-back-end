const departmentRepository = require('../repositories/department');

const create = (req, res) => departmentRepository.create(req.body)
  .then(id => res.send(id));

const findAll = (req, res) => departmentRepository.findAll()
  .then(events => {
    res.send(events);
  });

const findById = (req, res) => {
  const id = +req.params.id;

  return departmentRepository.findById(id)
    .then(event => {
      if (event) {
        res.send(event);
      } else {
        res.status(404).send({ errorMessage: 'Department not found!' });
      }
    })
};

module.exports = {
  create,
  findAll,
  findById
}
