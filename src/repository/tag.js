const {db} = require("./db");

const createTag = tag => {
    return db('events.tag').insert({
        name: tag.name,
        color: tag.color
    }).returning('id');
}

const findAll = () => {
    return db({t: 'events.tag'})
        .select([
            'id',
            'name',
            'color'
        ]);
}

const findById = id => {
    return findAll().where({id}).first();
}

const findByKeyword = keyword => {
    const pattern = `%${keyword.replace('_', '\\_').replace('%', '\\%')}%`
    return findAll().whereILike('name', pattern);
}

module.exports = {
    createTag,
    findAll,
    findById,
    findByKeyword
}
