const { validationResult } = require('express-validator');

const tagRepository = require('../repositories/tag');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const tag = req.body;

  const [{ id }] = await tagRepository.create(tag);

  tag.id = id;

  res.status(201).send(tag);
}

const findAll = (req, res) => {
  return (
    req.query.keyword
      ? tagRepository.findByKeyword(req.query.keyword)
      : tagRepository.findAll()
  ).then(events => {
    res.send(events);
  });
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
