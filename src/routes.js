const express = require('express');
const { registerController, loginController } = require('./controllers/user.controller');
const routes = express();

routes.post('/user', registerController);
routes.post('/user/login', loginController);

module.exports = routes;