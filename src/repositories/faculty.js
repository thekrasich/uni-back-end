const { db } = require("./db");

const create = ({ name }) => {
  return db('departments.faculty').insert({ name }, 'id');
}

const findAll = async () => {
  const faculties = await db({ f: 'departments.faculty' })
    .innerJoin('departments.department as d', 'd.faculty_id', '=', 'f.id')
    .select([
      'f.id',
      'f.name',
      'd.id as departmentId',
      'd.name as departmentName'
    ])
    .orderBy('f.id', 'asc');

  return faculties.reduce((result, row) => {
    if (result.length < row.id) {
      result.push({
        id: row.id,
        name: row.name,
        departments: []
      });
    }

    result[row.id - 1].departments.push({ id: row.departmentId, name: row.departmentName });
    return result;
  }, []);
}

const findById = async id => {
  const { name } = await db({ f: 'departments.faculty' })
    .select('name')
    .where('f.id', '=', id)
    .first();
  const departments = await db({ d: 'departments.department' })
    .select('*')
    .where('d.faculty_id', '=', id);

  return {
    id,
    name,
    departments: departments.map(({ id, name }) => ({ id, name }))
  };
}

module.exports = {
  create,
  findAll,
  findById
}