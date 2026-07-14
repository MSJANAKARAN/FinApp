const Joi = require("joi");

const addMemberSchema = Joi.object({
    memberName: Joi.string().trim().min(2).max(100).required(),
    memberEmail: Joi.string().trim().email().required()

});

module.exports=addMemberSchema;