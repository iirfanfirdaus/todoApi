const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const { JwtFilter } = require('../middleware/RequestFilter');
const { celebrate } = require('celebrate');
const { createUserParamSchema, getAllUserParamsSchema, getOneUserParamsSchema, updateUserParamSchema, changePassUserParamSchema } = require('../schema/UserSchema');
// base route /users
const ctrl = new UserController()

router.post('/register', celebrate({ body: createUserParamSchema }), ctrl.doCreate);
router.get('/', celebrate({ body: getAllUserParamsSchema }), JwtFilter, ctrl.doGetAll);
router.get('/:id', celebrate({ body: getOneUserParamsSchema }), JwtFilter, ctrl.doGetOne);
router.put('/:id', celebrate({ body: updateUserParamSchema }), JwtFilter, ctrl.doUpdate);
router.put('/changePass/:id', celebrate({ body: changePassUserParamSchema }), JwtFilter, ctrl.doChangePassword);
module.exports = router