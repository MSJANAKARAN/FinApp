const memberService = require("../services/member-service");

const addMember = async (req, res, next) => {

    try {

        const member = await memberService.addMember(
            req.params.groupId,
            req.body
        );

        res.status(201).json({
            success: true,
            data: member
        });

    } catch (error) {
        next(error);
    }

};

const deleteMember = async (req, res, next) => {

    try {

        const member = await memberService.deleteMember(
            req.params.groupId,
            req.user.email
        );

        res.json({
            success: true,
            message: "Member deleted successfully."
        });

    } catch (error) {
        next(error);
    }

};

const updateRole = async (req, res, next) => {

    try {

        const member = await memberService.updateRole(
            req.params.groupId,
            req.params.memberId,
            req.body.role);

        res.json({
            success: true,
            message: "Member role updated successfully.",
            data: member
        });

    } catch (error) {
        next(error);
    }

};
const getPermissions = async (req, res, next) => {

    try {

        const permissions = await memberService.getPermissions(
            req.params.groupId,
            req.params.memberId
        );

        res.json({
            success: true,
            data: permissions
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    addMember, deleteMember, updateRole, getPermissions
};