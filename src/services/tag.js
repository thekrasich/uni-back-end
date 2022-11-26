const tagRepository = require('../repositories/tag');

const create = async (req, res) => {
  const tag = await tagRepository.create(req.body);
  res.status(201).send(tag);
}

const findAll = (req, res) => {
  return tagRepository.findAll(req.body)
    .then(events => res.send(events));
}


const findById = (req, res) => {
  const id = +req.params.id;

  return tagRepository.findById(id)
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
  findAll,
  findById
}
