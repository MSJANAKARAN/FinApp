const memberRepository = require("../repositories/member-repository");

const addMember = async (groupId, request) => {

    const duplicate = await memberRepository.exists(
        groupId,
        request.memberEmail
    );

    if (duplicate) {
        throw new Error("Member already exists.");
    }
    const transaction = await sequelize.transaction();

    try {
        const member = await memberRepository.create({
            group_id: groupId,
            memberName: request.memberName,
            memberEmail: request.memberEmail
        }, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
    return member;
};
const deleteMember = async (groupId, request) => {

    const member = await memberRepository.exists(
        groupId,
        request.memberEmail
    );

    if (!member) {
        throw new Error("Member already exists.");
    }

    const transaction = await sequelize.transaction();

    try {
        await memberRepository.deleteMember(member, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateRole = async (groupId, memberId, role) => {

    const member = await memberRepository.findById(
        memberId
    );

    if (!member) {
        throw new AppError(
            404,
            "Member not found."
        );
    }

    if (member.groupId !== Number(groupId)) {
        throw new AppError(
            400,
            "Invalid member."
        );
    }

    member.role = role;

    return memberRepository.update(member);

};

const getPermissions = async (groupId, memberId) => {

    const member = await memberRepository.findById(
        memberId
    );

    if (!member) {
        throw new AppError(
            404,
            "Member not found."
        );
    }

    return {
        memberId: member.id,
        role: member.role,
        permissions:
            rolePermissions[
            member.role
            ] || []
    };

};



module.exports = {
    addMember, deleteMember, updateRole, getPermissions
};