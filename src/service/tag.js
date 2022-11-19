const tagRepository = require('../repository/tag');

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
                res.status(404).send({errorMessage: 'Tag not found!'});
            }
        })
};

module.exports = {
    findAll,
    findById
}
