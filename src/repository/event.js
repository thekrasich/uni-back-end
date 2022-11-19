const {db} = require("./db");

const createEvent = (event) => db('events.event').insert({
    user_creator_id: event.userCreatorId,
    title: event.title,
    description: event.description,
    department_id: event.departmentId,
    starts_at: event.startsAt,
    ends_at: event.endsAt
}).returning('id');

const findAll = () => {
    return db({e: 'events.event'})
        .leftJoin('departments.department as d', 'e.department_id', '=', 'd.id')
        .leftJoin('departments.faculty as f', 'd.faculty_id', '=', 'f.id')
        .select([
            'e.id', 
            'e.user_creator_id as userCreatorId', 
            'e.title',
            'e.description', 
            'e.department_id as departmentId',
            'd.name as departmentName',
            'f.id as facultyId',
            'f.name as facultyName',
            'e.starts_at as startsAt', 
            'e.ends_at as endsAt',
            'e.created_at as createdAt'
        ]);
}

const findById = id => {
    return findAll().where({id}).first();
}

module.exports = {
    findAll,
    findById,
    createEvent
}
