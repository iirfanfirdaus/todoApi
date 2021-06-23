const { Joi } = require('celebrate')

const createUserParamSchema = Joi.object().keys({
    email: Joi.string().email().max(100).required(),
    name: Joi.string().max(50).required(),
    password: Joi.string().min(6).required()
}).unknown(true)

const getAllUserParamsSchema = Joi.object().keys({
    name: Joi.string().allow("").max(50).optional(),
    email: Joi.string().allow("").max(100).optional()
}).unknown(true)

const getOneUserParamsSchema = Joi.object().keys({
    name: Joi.string().allow("").max(50).optional(),
    email: Joi.string().allow("").max(100).optional()
}).unknown(true)

const updateUserParamSchema = Joi.object().keys({
    name: Joi.string().max(50).required()
}).unknown(true)

const changePassUserParamSchema = Joi.object().keys({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
}).unknown(true)

module.exports = { createUserParamSchema, getAllUserParamsSchema, getOneUserParamsSchema, updateUserParamSchema, changePassUserParamSchema }