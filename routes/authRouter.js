const express = require('express');
const router = express.Router();
const AuthController = require('../controller/AuthController');
const { celebrate } = require('celebrate');
const { loginParamSchema } = require('../schema/AuthSchema');
// base route /users
const ctrl = new AuthController()

// base route /auth
router.post('/login', celebrate({ body: loginParamSchema }), ctrl.login);

module.exports = router