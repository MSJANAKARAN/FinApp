const { success } = require("zod");
const groupService = require("../services/group-service");

const getGroups = async (req, res, next) => {
    try {
        const groups = await groupService.getGroups(req.user.email);

        res.json({
            success: true,
            data: groups
        });
    } catch (error) {
        next(error);
    }
};

const createGroup = async (req, res, next) => {
    try {
        console.log(req.user);
        const group = await groupService.createGroup(req.body, req.user.email);
        res.status(201).json({
            success: true,
            message: "Group created successfully.",
            data: group
        });
    } catch (error) {
        next(error);
    }
};


const updateGroup = async (req, res, next) => {
    try {
        const group = await groupService.updateGroup(req.params.id, req.body, req.user.email);
        res.json({
            success: true,
            message: "Group updated successfully.",
            data: group
        });
    } catch (error) {
        next(error);
    }
};


const deleteGroup = async (req, res, next) => {
    try {
        await groupService.deleteGroup(req.params.id, req.user.email);
        res.json({
            success: true,
            message: "Group deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

const getGroup = async (req, res, next) => {
    try {
        const group = await groupService.getGroup(req.params.id, req.user.email);
        res.json({
            success: true,
            data: group
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getGroups, createGroup, updateGroup, deleteGroup, getGroup };