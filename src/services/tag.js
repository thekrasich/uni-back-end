const tagRepo = require('../repositories/tag');

const create = async (req, res) => {
  const tag = await tagRepo.create(req.body);
  res.status(201).send(tag);
}

const update = (req, res) => {
  tagRepo.update(req.params.id, req.body).then(tag => {
    if (tag) {
      res.status(204).send(tag)
    } else {
      res.status(404).send({ errorMessage: 'Tag not found' })
    }
  });
}

const remove = async (req, res) => {
  tagRepo.remove(req.params.id)
    .then(({ found, affectedEventsNumber }) => {
      if (found) {
        res.status(200).send({ affectedEventsNumber })
      } else {
        res.status(404).send({ errorMessage: 'Tag not found' });
      }
    })
}

const findAll = (req, res) => {
  return tagRepo.findAll(req.body)
    .then(tags => res.send({ items: tags }));
}


const findById = (req, res) => {
  const id = +req.params.id;

  return tagRepo.findById(id)
    .then(event => {

      if (event) {
        res.send(event);
      } else {
        res.status(404).send({ errorMessage: 'Tag not found!' });
      }
    })
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  findById
}
