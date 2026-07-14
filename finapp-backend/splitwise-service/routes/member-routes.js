const express = require("express");
const authenticate = require("../middleware/auth-middleware");
const validate = require("../middleware/validation-middleware");
const addMemberSchema = require("../validations/member-validation");
const controller = require("../controllers/member-controller")
const router = express.Router({ mergeParams: true });
const authorize = require("../middleware/authorize");
const Permissions = require("../constants/permissions");


router.post("/", authenticate, validate(addMemberSchema), authorize(Permissions.MEMBER_ADD), controller.addMember);

router.delete("/:memberId", authenticate, authorize(Permissions.MEMBER_REMOVE), controller.deleteMember);

router.put("/:memberId/role", authenticate, authorize(Permissions.MEMBER_ROLE_UPDATE), controller.updateRole);

router.get("/:memberId/permissions", authenticate, controller.getPermissions);

module.exports = router; 