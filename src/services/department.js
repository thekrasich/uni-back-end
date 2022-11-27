const departmentRepo = require('../repositories/department');

const create = (req, res) => departmentRepo.create(req.body)
  .then(id => res.send(id));

const findAll = (req, res) => departmentRepo.findAll()
  .then(departments => {
    res.send({ items: departments });
  });

const findById = (req, res) => {
  const id = +req.params.id;

  return departmentRepo.findById(id)
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
