const { db } = require("./db");

const create = ({ name }) => {
  return db('departments.faculty').insert({ name }, 'id');
}

const reduceDepartments = faculties => {
  return Array.from(faculties.reduce((result, row) => {
    if (!result.has(row.id)) {
      result.set(row.id, {
        id: row.id,
        name: row.name,
        url: row.url,
        departments: []
      });
    }
    row.departmentId && result.get(row.id).departments.push({
      id: row.departmentId,
      name: row.departmentName,
      url: row.departmentUrl
    });
    return result;
  }, new Map()).values());
}

const fetchAll = () => db({ f: 'departments.faculty' })
  .innerJoin('departments.department as d', 'd.faculty_id', '=', 'f.id')
  .select([
    'f.id',
    'f.name',
    'f.url',
    'd.id as departmentId',
    'd.name as departmentName',
    'd.url as departmentUrl'
  ]);

const findAll = () => {
  return fetchAll().then(reduceDepartments);
}

const findById = id => fetchAll()
  .where('f.id', '=', id)
  .then(reduceDepartments)

module.exports = {
  create,
  findAll,
  findById
}