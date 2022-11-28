const { db } = require("./db");

const create = ({ facultyId, name, url }) => {
  try {
    return db('departments.department')
      .insert({ faculty_id: facultyId, name, url }, 'id');
  } catch (e) {
    console.log(e);
  }
}

const fetchAll = () =>
  db({ d: 'departments.department' })
    .innerJoin('departments.faculty as f', 'f.id', '=', 'd.faculty_id')
    .select([
      'd.id',
      'd.name',
      'd.url',
      'f.id as facultyId',
      'f.name as facultyName',
      'f.url as facultyUrl'
    ]);

const nestFaculty = ({ id, name, url, ...faculty }) =>
  ({
    id,
    name,
    url,
    faculty: {
      id: faculty.facultyId,
      name: faculty.facultyName,
      url: faculty.facultyUrl
    }
  });

const findAll = async () =>
  (await fetchAll()).map(nestFaculty)

const findById = async id => {
  const department = await fetchAll()
    .where('d.id', id)
    .first();
  return department && nestFaculty(department);
}

module.exports = {
  create,
  findAll,
  findById
}
