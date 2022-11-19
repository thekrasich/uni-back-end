const {db} = require("./db");

const findAll = () => {
    return db({f: 'departments.faculty'})
        .innerJoin('departments.department as d', 'd.faculty_id', '=', 'f.id')
        .select([
            'f.id',
            'f.name',
            'd.id as departmentId',
            'd.name as departmentName'
        ]).then(faculties => faculties.reduce((result, row) => {
            if(result.length < row.id) {
                result.push({
                    id: row.id,
                    name: row.name,
                    departments: []
                });
            }

            result[row.id-1].departments.push({id: row.departmentId, name: row.departmentName});
            return result;
        }, []));
}

module.exports = {
    findAll
}