const {db} = require("./db");

const createEvent = event => {
    console.log('begin transaction');

    return db.transaction(trx => {

        const tags = event.tags.map(tagId => ({
            tag_id: tagId
        }));

        return trx
            .insert({
                creator_user_id: event.creatorUserId,
                title: event.title,
                description: event.description,
                department_id: event.departmentId,
                starts_at: event.startsAt,
                ends_at: event.endsAt
            }, 'id')
            .into('events.event')
            .then(id => {
                tags.forEach(tag => tag.event_id = id);
                return trx('events.event_tag').insert(tags);
            })

        // db.insert({
        //     creator_user_id: event.creatorUserId,
        //     title: event.title,
        //     description: event.description,
        //     department_id: event.departmentId,
        //     starts_at: event.startsAt,
        //     ends_at: event.endsAt
        // }, 'id')
        // .into('events.event')
        // .transacting(trx)
        // .then(id => {
        //     tags.forEach(tag => tag.event_id = id);
        //     return db('events.event_tag').insert(tags).transacting(trx);
        // })
        // .then(trx.commit)
        // .catch(trx.rollback);
    });

    // return db.transaction(trx => {
    //     const tags = event.tags.map(tagId => ({
    //         tag_id: tagId
    //     }));

    //     db.insert({
    //         creator_user_id: event.creatorUserId,
    //         title: event.title,
    //         description: event.description,
    //         department_id: event.departmentId,
    //         starts_at: event.startsAt,
    //         ends_at: event.endsAt
    //     }, 'id')
    //     .into('events.event')
    //     .transacting(trx)
    //     .then(id => {
    //         tags.forEach(tag => tag.event_id = id);
    //         return db('events.event_tag').insert(tags).transacting(trx);
    //     })
    //     .then(trx.commit)
    //     .catch(trx.rollback);
    // });

    // return db.transaction(trx => {
    //     db('events.event')
    //         .insert({
    //             creator_user_id: event.creatorUserId,
    //             title: event.title,
    //             description: event.description,
    //             department_id: event.departmentId,
    //             starts_at: event.startsAt,
    //             ends_at: event.endsAt
    //         })
    //         .returning('id')
    //         .transacting(trx)
    //         .then(id => {
    //             db('events.event_tag')
    //                 .insert(event.tags.map(tagId => ({
    //                     tag_id: tagId, 
    //                     event_id: id.id})))
    //                 .transacting(trx);
    //             return id;
    //         })
    //         .then(trx.commit)
    //         .catch(trx.rollback);
    // });

    // return db.transaction(trx => {
    //     db('events.event')
    //         .insert({
    //             creator_user_id: event.creatorUserId,
    //             title: event.title,
    //             description: event.description,
    //             department_id: event.departmentId,
    //             starts_at: event.startsAt,
    //             ends_at: event.endsAt
    //         })
    //         .returning('id')
    //         .transacting(trx)
    //         .then(id => {
    //             db('events.event_tag')
    //                 .insert(event.tags.map(tagId => ({
    //                     tag_id: tagId, 
    //                     event_id: id.id})))
    //                 .transacting(trx);
    //             return id;
    //         })
    //         .then(trx.commit)
    //         .catch(trx.rollback);
    // });




    // return db.transaction(trx => {
    //     trx.insert({
    //         creator_user_id: event.creatorUserId,
    //         title: event.title,
    //         description: event.description,
    //         department_id: event.departmentId,
    //         starts_at: event.startsAt,
    //         ends_at: event.endsAt})
    //     .into(('events.event'))
    //     .returning('id')
    //     .then(id => {
    //         trx.insert(event.tags.map(tagId => ({tag_id: tagId, event_id: id}))).into('events.event_tag')
    //         return id;
    //     }).then(id => {
    //         trx.commit;
    //         return id;
    //     })
    //     .catch(trx.rollback);
    // });
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
    return db({e: 'events.event'})
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
      from && b.where('endsAt', '>=', from);
      to && b.where('startsAt', '<=', to);
      departments && departments.length > 0 && b.whereIn('departmentId', departments);
      faculties && faculties.length > 0 && b.whereIn('facultyId', faculties);
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

module.exports = {
  findAll,
  findById
}
