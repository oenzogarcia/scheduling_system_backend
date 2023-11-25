const express = require('express');
const {
        registerController,
        loginController,
        twoStepVerificationController,
        recoverPasswordMessageController, 
        recoverPasswordController
        } = require('../controllers/authentication.controller');

const authRoutes = new express();

authRoutes.post('/user', registerController);
authRoutes.post('/user/login', loginController);
authRoutes.get('/user/verification-account/:token', twoStepVerificationController);
authRoutes.post('/user/recover-password', recoverPasswordMessageController);
authRoutes.post('/user/recover', recoverPasswordController);

module.exports = authRoutes;