const { db } = require("./db");

const create = ({ name, color }) => {
  return db('events.tag').insert({ name, color, }, '*')
    .then(([tag]) => tag);
}

const findAll = ({keyword} = {}) => {
  return db({ t: 'events.tag' })
    .select(['id', 'name', 'color'])
    .modify(b => {
      keyword && b.whereILike('name', `%${keyword}%`);
    });
}

const findById = id => {
  return findAll().where({ id }).first();
}

module.exports = {
  create,
  findAll,
  findById
}
