const { validationResult } = require('express-validator');

const eventRepository = require('../repository/event');

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const event = req.body;
    event.creatorUserId = req.userId;

    const [{id}] = await eventRepository.createEvent(event);

    event.id = id;

    res.status(201).send(event);
}

const findAll = (req, res) => {
    return (
        req.query.tags
        ? eventRepository.findByTags(req.query.tags.split(','))
        : eventRepository.findAll()
    ).then(events => res.send(events))
}

const findById = (req, res) => {
    const id = +req.params.id;

    return eventRepository.findById(id)
        .then(event => {

            if (event) {
                res.send(event);
            } else {
                res.status(404).send({errorMessage: 'Event not found!'});
            }
        })
}

module.exports = {
    create,
    findAll,
    findById
}
