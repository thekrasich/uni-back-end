const { db } = require("./db");

const TABLE = 'events.tag';

const create = ({ name, color }) => {
  return db(TABLE).insert({ name, color, }, '*')
    .then(([tag]) => tag);
}

const update = (id, { name, color }) => db(TABLE)
  .where('id', '=', id)
  .update({ name, color })
  .then(n => n > 0 && { id, name, color });

const remove = async id => {
  const trx = await db.transaction();

  try {
    const affectedEventsNumber = await trx('events.event_tag')
      .where('tag_id', '=', id)
      .del();

    const n = await trx(TABLE)
      .where('id', '=', id)
      .del();

    await trx.commit();

    return { found: n > 0, affectedEventsNumber };
  } catch (e) {
    await trx.rollback();
    console.log(e);
    throw e;
  }
}

const findAll = ({ keyword } = {}) => {
  return db({ t: TABLE })
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
  update,
  remove,
  findAll,
  findById
}
