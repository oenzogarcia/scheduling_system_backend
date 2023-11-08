const express = require('express');
const { register, login } = require('./controllers/users');
const validateLogin = require('./middlewares/loginValidation');
const routes = express();

routes.post('/user', register);
routes.post('/login', login);

routes.use(validateLogin);

module.exports = routes;