const { Joi } = require('celebrate')

const loginParamSchema = Joi.object().keys({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).required()
}).unknown(true)

module.exports = { loginParamSchema }