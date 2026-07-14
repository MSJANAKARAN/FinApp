const express = require("express");
const authenticate = require("../middleware/auth-middleware");
const validate = require("../middleware/validation-middleware");
const { createGroupSchema, updateGroupSchema } = require("../validations/group-validation");
const controller = require("../controllers/group-controller");
const authorize = require("../middleware/authorize");
const router = express.Router();
const Permissions = require("../constants/permissions");

router.get("/", authenticate, controller.getGroups);

router.post("/", authenticate, validate(createGroupSchema), controller.createGroup);

router.put("/", authenticate, authorize(Permissions.GROUP_EDIT), validate(updateGroupSchema), controller.updateGroup);

router.delete("/", authenticate, authorize(Permissions.GROUP_DELETE), controller.deleteGroup);

router.get("/:id", authenticate, controller.getGroup);


module.exports = router; 