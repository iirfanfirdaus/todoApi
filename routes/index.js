const { Router } = require('express');

const routes = Router();

routes.use('/auth', require('./authRouter'));
routes.use('/user', require('./UserRouter'));
routes.use('/todo', require('./TodoRouter'));

module.exports = routes;