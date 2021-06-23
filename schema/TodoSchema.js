const { Joi } = require('celebrate')

const createTodoParamsSchema = Joi.object().keys({
    title: Joi.string().max(50).required(),
    description: Joi.string().max(150).required(),
    dueDate: Joi.string().required(),
}).unknown(true)

const getAllTodoParamsSchema = Joi.object().keys({
    title: Joi.string().allow("").max(50).optional(),
    description: Joi.string().allow("").max(150).optional(),
    dueDate: Joi.string().allow("").max(50).optional(),
    startDate: Joi.string().allow("").max(50).optional(),
    author: Joi.string().allow("").max(50).optional(),
}).unknown(true)

const getOneTodoParamsSchema = Joi.object().keys({
    title: Joi.string().allow("").max(50).optional(),
    description: Joi.string().allow("").max(150).optional(),
    dueDate: Joi.string().allow("").max(50).optional(),
    startDate: Joi.string().allow("").max(50).optional(),
    author: Joi.string().allow("").max(50).optional(),
}).unknown(true)

const updateTodoParamsSchema = Joi.object().keys({
    title: Joi.string().max(50).required(),
    description: Joi.string().max(150).required(),
}).unknown(true)

module.exports = { createTodoParamsSchema, getAllTodoParamsSchema, getOneTodoParamsSchema, updateTodoParamsSchema }