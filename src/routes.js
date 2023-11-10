const express = require('express');
const { registerController, loginController } = require('./controllers/user.controller');
const teste = require('./controllers/teste');
const { verifyLoggedUser } = require('./middlewares/auth.middleware');
const routes = express();

routes.post('/user', registerController);
routes.post('/user/login', loginController);

routes.use(verifyLoggedUser);

routes.get('/user/oi', teste);

module.exports = routes;