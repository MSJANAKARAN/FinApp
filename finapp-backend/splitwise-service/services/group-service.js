const groupRepository = require("../repositories/group-repository");
const memberRepository = require("../repositories/member-repository");
const sequelize = require("../config/database");
const AppError = require("../exceptions/app-error");


const getGroups = (email) => groupRepository.findAllByMember(email);

const createGroup = async (request, email) => {
    //Equivalent @Transactional in Spring Boot, rollback all when one fails
    const transaction = await sequelize.transaction();
    try {
        const group = await groupRepository.create({
            name: request.name,
            description: request.description,
            createdByEmail: email
        }, transaction);

        await memberRepository.create({
            group_id: group.id,
            memberName: "You",
            memberEmail: email,
            role: "OWNER"
        }, transaction);
        await transaction.commit();
        return group;
    } catch (error) {
        await transaction.rollback();
            console.log(error);

        throw error;
    }

};

const updateGroup = async (groupId, request, email) => {

    const group = await groupRepository.findByIdAndMember(
        groupId,
        email
    );

    if (!group) {
        throw new AppError(404, "Group not found.");
    }
    try {
        const transaction = await sequelize.transaction();

        group.name = request.name;
        group.description = request.description;
        await groupRepository.update(group, transaction);
        await transaction.commit();

        return group;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

};

const deleteGroup = async (groupId, email) => {

    const group = await groupRepository.findByIdAndMember(
        groupId,
        email
    );

    if (!group) {
        throw new AppError(404, "Group not found.");
    }
    const transaction = await sequelize.transaction();

    try {
        await groupRepository.remove(group, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }

};

const getGroup = async (groupId, email) => {

    const group = await groupRepository.findByIdAndMember(
        groupId,
        email
    );

    if (!group) {
        throw new AppError(404, "Group not found.");
    }

    return group;
};

module.exports = { getGroups, createGroup, updateGroup, deleteGroup, getGroup }