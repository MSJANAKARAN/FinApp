const Group = require("../models/group");

const create = (group, transaction) => {
   return Group.create(group, { transaction });
}


const findById = (groupId) => Group.findByPk(id);


const findByIdAndMember = (groupId, email) => {

    return Group.findOne({
        where: {
            id: groupId
        },
        include: [{
            model: Member,
            as: "members",
            where: {
                memberEmail: email
            },
            attributes: []
        }]
    });

};

const findAllByMember = (email) =>
    Group.findAll({
        include: [{
            model: Member,
            as: "members",
            where: {
                memberEmail: email
            },
            attributes: []
        }]
    });

const update = (group, transaction) =>
    group.save({ transaction });

const remove = (group, transaction) =>
    group.destroy({ transaction });

module.exports = {
    create,
    findById,
    findByIdAndMember,
    findAllByMember,
    update,
    remove
};