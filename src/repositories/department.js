const { db } = require("./db");

const create = ({ facultyId, name }) => {
  return db('departments.department')
    .insert({ faculty_id: facultyId, name }, 'id');
}

const fetchAll = () => db({ d: 'departments.department' })
  .innerJoin('departments.faculty as f', 'f.id', '=', 'd.faculty_id')
  .select([
    'd.id',
    'd.name',
    'd.url',
    'f.id as facultyId',
    'f.name as facultyName',
    'f.url as facultyUrl'
  ]);

const nestFaculty = ({id, name, url, ...faculty}) => ({
  id,
  name,
  url,
  faculty: {
    id: faculty.facultyId,
    name: faculty.facultyName,
    url: faculty.facultyUrl
  }
})

const findAll = () => fetchAll().then(rows => rows.map(nestFaculty));

const findById = id => {
  return fetchAll().where('d.id', id).first().then(nestFaculty);
}

module.exports = {
  create,
  findAll,
  findById
}
