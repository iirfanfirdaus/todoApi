const express = require('express');
const router = express.Router();
const TodoController = require('../controller/TodoController');
const AuthController = require('../controller/AuthController');
const { JwtFilter } = require('../middleware/RequestFilter');
const { celebrate } = require('celebrate');
const { createTodoParamsSchema, getAllTodoParamsSchema, getOneTodoParamsSchema, updateTodoParamsSchema } = require('../schema/TodoSchema');
// base route /todo
const ctrl = new TodoController()
const auth = new AuthController()

// all to be protected by jwt token and get auth data
router.all('/*', JwtFilter, auth.getUserId);

router.post('/', celebrate({ body: createTodoParamsSchema }), ctrl.doCreate);
router.get('/', celebrate({ body: getAllTodoParamsSchema }), ctrl.doGetAll);
router.get('/:id', celebrate({ body: getOneTodoParamsSchema }), ctrl.doGetOne);
router.put('/:id', celebrate({ body: updateTodoParamsSchema }), ctrl.doUpdate);
router.delete('/:id', ctrl.doDelete);

module.exports = router