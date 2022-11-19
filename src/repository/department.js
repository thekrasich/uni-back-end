const {db} = require("./db");

const findAll = () => {
    return db({d: 'departments.department'})
        .innerJoin('departments.faculty as f', 'f.id', '=', 'd.faculty_id')
        .select([
            'd.id',
            'd.name',
            'f.id as facultyId',
            'f.name as facultyName'
        ]);
}

const findById = id => {
    return findAll().where('d.id', id).first();
}

module.exports = {
    findAll,
    findById
}
