const { validationResult } = require('express-validator');

const eventRepo = require('../repositories/event');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const event = req.body;
  // temporarily, for testing
  // event.creatorUserId = req.user.id;
  event.creatorUserId = 11;
  event.id = await eventRepo.create(event);

  res.status(201).send(event);
}

const onlyEventCreator = actionName => async (req, res, next) => {
  const {creatorUserId} = await eventRepo.findCreatorUserIdByEventId(req.params.id);

  if(!creatorUserId) {
    res.status(404).send({ errorMessage: "Event not found" });
  }

  if(creatorUserId !== req.user.id) {
    res.status(401).send({errorMessage: `Only the creator of an event can ${actionName} that event`});
  }

  next();
}

const findById = (req, res) => {
  const id = +req.params.id;

  return eventRepo.findById(id)
    .then(event => {

      if (event) {
        res.send(event);
      } else {
        res.status(404).send({ errorMessage: 'Event not found!' });
      }
    })
}

const findTagsByEventId = (req, res) => {
  return eventRepo.findTagsByEventId(+req.params.id)
    .then(tags => res.send({ items: tags }))
    .catch(_ => res.status(404).send({ errorMessage: 'Event not found' }))
}

module.exports = {
  create,
  findAll,
  findById,
  findTagsByEventId
}
