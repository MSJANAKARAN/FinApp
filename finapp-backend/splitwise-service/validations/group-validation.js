const Joi = require("joi");

const createGroupSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(255).allow("", null)
});

const updateGroupSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(255).allow("", null)
});

module.exports = { createGroupSchema, updateGroupSchema };