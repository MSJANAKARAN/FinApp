const Permissions = require("../constants/permissions");

module.exports = {

    OWNER: [
        Permissions.GROUP_EDIT,
        Permissions.GROUP_DELETE,
        Permissions.MEMBER_ADD,
        Permissions.MEMBER_REMOVE,
        Permissions.MEMBER_ROLE_UPDATE,
        Permissions.EXPENSE_CREATE,
        Permissions.EXPENSE_EDIT,
        Permissions.EXPENSE_DELETE
    ],

    ADMIN: [
        Permissions.GROUP_EDIT,
        Permissions.MEMBER_ADD,
        Permissions.MEMBER_REMOVE,
        Permissions.EXPENSE_CREATE,
        Permissions.EXPENSE_EDIT
    ],

    MEMBER: [
        Permissions.EXPENSE_CREATE
    ]

};