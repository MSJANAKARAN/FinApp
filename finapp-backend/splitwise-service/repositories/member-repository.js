const Member = require("../models/member");

const create = (member, transaction) => {
    return Member.create(member, { transaction });
}

const findByGroup = (groupId) =>
    Member.findAll({
        where: {
            group_id: groupId
        }
    });

const findByGroupAndEmail = (groupId, email) =>
    Member.findAll({
        where: {
            group_id: groupId,
            member_email: email
        }
    });

const exists = (groupId, email) =>
    Member.findOne({
        where: {
            group_id: groupId,
            member_email: email
        }
    });

const deleteMember = (member,transaction) =>
    member.destroy({transaction});

const findById = (id) => {
    return Member.findByPk(id);
};

const update = (member) => {
    return member.save();
};

module.exports = {
    create,
    findByGroup,
    findByGroupAndEmail,
    exists,
    deleteMember,
    findById,
    update
};