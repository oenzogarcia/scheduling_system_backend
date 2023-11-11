const express = require('express');
const { registerController, loginController, twoStepVerification } = require('./controllers/user.controller');
const { verifyLoggedUser } = require('./middlewares/auth.middleware');
const routes = express();

routes.post('/user', registerController);
routes.post('/user/login', loginController);
routes.get('/user/recover-password/:token', twoStepVerification );




module.exports = {
    routes
};