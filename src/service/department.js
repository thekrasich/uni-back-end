const departmentRepository = require('../repository/department');

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
                res.status(404).send({errorMessage: 'Department not found!'});
            }
        })
};

module.exports = {
    findAll,
    findById
}
