const { db } = require("./db");

const create = async ({ creatorUserId, title, description, departmentId, startsAt, endsAt, tags }) => {
  const trx = await db.transaction();

  return trx.insert({
    creator_user_id: creatorUserId,
    title,
    description,
    department_id: departmentId,
    starts_at: startsAt,
    ends_at: endsAt
  }, 'id')
    .into('events.event')
    .then(([{ id }]) => {
      if (tags && tags.length > 0) {
        console.log("tags && tags.length > 0");
        console.log(`inserted event id: ${id}`)
        const event_tags = tags.map(tagId => ({
          tag_id: tagId,
          event_id: id
        }));

        return trx.insert(event_tags, '*')
          .into('events.event_tag')
          .then(ids => {
            console.log("Inserted event_tag ids");
            console.log(ids);
            return id;
          });
      } else {
        console.log(`Promise.resolve(${id})`)
        return Promise.resolve(id);
      }
    })
    .then(id => {
      return trx.rollback().then(_ => id);
    })
    .catch(e => {
      return trx.rollback().then(_ => {
        console.log(e);
        throw e;
      });
    });
};

const reduceTags = events => {
  return Array.from(events.reduce((result, row) => {
    if (!result.has(row.id)) {
      result.set(row.id, {
        id: row.id,
        creatorUserId: row.creatorUserId,
        title: row.title,
        description: row.description,
        department: {
          id: row.departmentId,
          name: row.departmentName,
          faculty: {
            id: row.facultyId,
            name: row.facultyName
          }
        },
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        tags: [],
        createdAt: row.createdAt
      });
    }
    row.tagId && result.get(row.id).tags.push({ id: row.tagId, name: row.tagName, color: row.tagColor });
    return result;
  }, new Map()).values());
}

const fetchAll = () => {
  return db({ e: 'events.event' })
    .leftJoin('departments.department as d', 'e.department_id', '=', 'd.id')
    .leftJoin('departments.faculty as f', 'd.faculty_id', '=', 'f.id')
    .leftJoin('events.event_tag as et', 'e.id', '=', 'et.event_id')
    .leftJoin('events.tag as t', 'et.tag_id', '=', 't.id')
    .select([
      'e.id',
      'e.creator_user_id as creatorUserId',
      'e.title',
      'e.description',
      'e.department_id as departmentId',
      'd.name as departmentName',
      'f.id as facultyId',
      'f.name as facultyName',
      't.id as tagId',
      't.name as tagName',
      't.color as tagColor',
      'e.starts_at as startsAt',
      'e.ends_at as endsAt',
      'e.created_at as createdAt'
    ]);
}

const findAll = ({ from, to, departments, faculties, tags }) => {
  return fetchAll()
    .modify(b => {
      from && b.where('ends_at', '>=', from);
      to && b.where('starts_at', '<=', to);
      departments && departments.length > 0 && b.whereIn('department_id', departments);
      faculties && faculties.length > 0 && b.whereIn('faculty_id', faculties);
      tags && b.whereIn('e.id', function () {
        this.select('et.event_id')
          .from('events.event_tag as et')
          .innerJoin('events.tag as t', 't.id', '=', 'et.tag_id')
          .whereIn('t.name', tags)
      });
    })
    .then(reduceTags);
}

const findById = id => {
  return fetchAll()
    .where('e.id', id)
    .then(events => reduceTags(events)[0]);
}

const findTagsByEventId = async id => {
  const event = await db('events.event').select('id').where('id', '=', id);
  if(!event) {
    throw new Error(`Event with id ${id} doesn't exist`);
  }

  return db({et: 'events.event_tag'})
    .innerJoin('events.tag as t', 't.id', '=', 'et.tag_id')
    .where('et.event_id', '=', id)
    .select(['t.id', 't.name', 't.color'])
}

module.exports = {
  create,
  findAll,
  findById,
  findTagsByEventId
}
