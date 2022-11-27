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

const update = async (req, res) => {
  const result = await eventRepo.update(req.params.id, req.body)
  if (result) {
    res.status(204).send(result);
  } else {
    res.status(404).send({ errorMessage: "Event not found" });
  }
}

const remove = async (req, res) => {

  const result = await eventRepo.remove(req.params.id);
  if (result) {
    res.status(204).send(result);
  } else {
    res.status(404).send({ errorMessage: "Event not found" });
  }
}

const findAll = async (req, res) => res.send({
  items: (await eventRepo.findAll(req.query))
});

const findById = async (req, res) => {
  const event = await eventRepo.findById(req.params.id);
  if(event) {
    res.send(event);
  }
  else {
    res.status(404).send({ errorMessage: "Event not found" });
  }
}

const findTagsByEventId = async (req, res) => {
  const tags = await eventRepo.findTagsByEventId(req.params.id);
  if(tags) {
    res.send({ items: tags });
  }
  else {
    res.status(404).send({ errorMessage: "Event not found" });
  }
}

module.exports = {
  create,
  onlyEventCreator,
  update,
  remove,
  findAll,
  findById,
  findTagsByEventId
}
