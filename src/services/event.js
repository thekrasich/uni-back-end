const { validationResult } = require('express-validator');

const eventRepository = require('../repositories/event');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const event = req.body;
  // temporarily, for testing
  // event.creatorUserId = req.user.id;
  event.creatorUserId = 11;
  event.id = await eventRepository.create(event);

  res.status(201).send(event);
}

const findAll = (req, res) => {
  return eventRepository.findAll(req.query)
    .then(events => res.send({ items: events }))
}

const findById = (req, res) => {
  const id = +req.params.id;

  return eventRepository.findById(id)
    .then(event => {

      if (event) {
        res.send(event);
      } else {
        res.status(404).send({ errorMessage: 'Event not found!' });
      }
    })
}

module.exports = {
  create,
  findAll,
  findById
}
