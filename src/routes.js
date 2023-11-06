const express = require('express');
const { register } = require('./controllers/users');
const routes = express();

routes.post('/user', register);

module.exports = routes;