const AppError = require("../exceptions/app-error");

const rolePermissions = require("../utils/role-permissions");

const memberRepository = require("../repositories/member-repository");

const authorize = (permission) => {

    return async (req, res, next) => {

        const groupId = req.params.groupId || req.params.id;

        const member = await memberRepository.findByGroupAndEmail(
            groupId,
            req.user.email
        );

        if (!member) {
            return next(new AppError(403, "Not a group member."));
        }

        const permissions = rolePermissions[member.role] || [];

        if (!permissions.includes(permission)) {
            return next(new AppError(403, "Access denied."));
        }

        next();

    };

};

module.exports = authorize;