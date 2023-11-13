const express = require('express');
const { registerController, loginController, twoStepVerificationController, recoverPasswordMessageController, recoverPasswordController } = require('./controllers/user.controller');
const { verifyLoggedUser } = require('./middlewares/auth.middleware');
const routes = express();

routes.post('/user', registerController);
routes.post('/user/login', loginController);
routes.get('/user/verification-account/:token', twoStepVerificationController);
routes.post('/user/recover-password', recoverPasswordMessageController);
routes.post('/user/recover', recoverPasswordController);

routes.post('/scheduling');

module.exports = {
    routes
};