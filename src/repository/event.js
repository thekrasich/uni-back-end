const {db} = require("./db");

const createEvent = (event) => db('events.event').insert({
    user_creator_id: event.userCreatorId,
    title: event.title,
    description: event.description,
    department_id: event.departmentId,
    starts_at: event.startsAt,
    ends_at: event.endsAt
}).returning('id');

// const reduceTags = query => {
//     return query.then(events => events.reduce((result, row) => {
//         if(result.length < row.id) {
//             const event = {...row, tags: []};
//             delete event.tagId;
//             delete event.tagName;
//             delete event.tagColor;
//             result.push(event);
//         }
//         row.tagId && result[row.id-1].tags.push({id: row.tagId, name: row.tagName, color: tagColor});
//         return result;
//     }, []));
// }

const reduceTags = events => {
    return events.reduce((result, row) => {
        if(result.length < row.id) {
            const event = {...row, tags: []};
            delete event.tagId;
            delete event.tagName;
            delete event.tagColor;
            result.push(event);
        }
        row.tagId && result[row.id-1].tags.push({id: row.tagId, name: row.tagName, color: tagColor});
        return result;
    }, [])
}

const fetchAll = () => {
    return db({e: 'events.event'})
        .leftJoin('departments.department as d', 'e.department_id', '=', 'd.id')
        .leftJoin('departments.faculty as f', 'd.faculty_id', '=', 'f.id')
        .leftJoin('events.event_tag as et', 'e.id', '=', 'et.event_id')
        .leftJoin('events.tag as t', 'et.tag_id', '=', 't.id')
        .select([
            'e.id', 
            'e.user_creator_id as userCreatorId', 
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

const findAll = () => {
    return fetchAll().then(reduceTags);
}

const findById = id => {
    return fetchAll().where('e.id', id).then(reduceTags)[0];
}

const findByTags = tags => {
    return fetchAll().whereIn('e.id', function() {
        this.select('et.event_id')
            .from('events.event_tag as et')
            .innerJoin('events.tag as t', 't.id', '=', 'et.tag_id')
            .whereIn('t.name', tags)
    }).then(reduceTags);
}

module.exports = {
    findAll,
    findById,
    findByTags,
    createEvent
}
