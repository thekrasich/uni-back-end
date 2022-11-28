const { db } = require("./db");

const create = ({ name, url }) =>
  db('departments.faculty')
    .insert({ name, url }, 'id');

const reduceDepartments = faculties =>
  Array.from(faculties.reduce((result, row) => {
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

const fetchAll = () =>
  db({ f: 'departments.faculty' })
    .innerJoin('departments.department as d', 'd.faculty_id', '=', 'f.id')
    .select([
      'f.id',
      'f.name',
      'f.url',
      'd.id as departmentId',
      'd.name as departmentName',
      'd.url as departmentUrl'
    ]);

const findAll = async () => {
  const faculties = await fetchAll();
  return reduceDepartments(faculties);
}

const findById = async id => {
  const faculties = await fetchAll()
    .where('f.id', '=', id);
  return reduceDepartments(faculties)[0];
}

module.exports = {
  create,
  findAll,
  findById
}