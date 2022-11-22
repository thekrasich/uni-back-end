const facultyRepository = require('../repositories/faculty');

const findAll = (req, res) => facultyRepository.findAll()
    .then(events => {
        res.send(events);
    });

module.exports = {
    findAll
}
