const express = require('express');
const {
    registerController,
    loginController,
    twoStepVerificationController,
    recoverPasswordMessageController,
    recoverPasswordController } = require('./controllers/user.controller');
const { verifyLoggedUser } = require('./middlewares/auth.middleware');
const {
    scheduleAppointmentController,
    listAppointmentsController,
    listAppointmentByIdController,
    updateAppointmentDateController,
    updateAppointmentPersonalInfoController,
    deleteAppointmentController } = require('./controllers/scheduling.controller');
const {
    createSpecialtyController,
    listSpecialtiesController,
    listSpecialtyByIdController,
    updateSpecialtyController,
    deleteSpecialtyController } = require('./controllers/specialty.controller');
const { listDoctorsController, listDoctorByIdController, registerDoctorController, updateDoctorController, deleteDoctorController } = require('./controllers/doctor.controller');
const routes = express();

routes.post('/user', registerController);
routes.post('/user/login', loginController);
routes.get('/user/verification-account/:token', twoStepVerificationController);
routes.post('/user/recover-password', recoverPasswordMessageController);
routes.post('/user/recover', recoverPasswordController);

routes.post('/specialty', createSpecialtyController);
routes.get('/specialty', listSpecialtiesController);
routes.get('/specialty/:id', listSpecialtyByIdController);
routes.put('/specialty/:id', updateSpecialtyController);
routes.delete('/specialty/:id', deleteSpecialtyController);

routes.post('/doctor', registerDoctorController);
routes.get('/doctor', listDoctorsController);
routes.get('/doctor/:id', listDoctorByIdController);
routes.put('/doctor/:id', updateDoctorController);
routes.delete('/doctor/:id', deleteDoctorController);

routes.use(verifyLoggedUser);

routes.post('/scheduling/schedule', scheduleAppointmentController);
routes.get('/scheduling/list', listAppointmentsController);
routes.get('/scheduling/list/:id', listAppointmentByIdController);
routes.put('/scheduling/:id/update/date', updateAppointmentDateController);
routes.put('/scheduling/:id/update/info', updateAppointmentPersonalInfoController);
routes.delete('/scheduling/:id/delete', deleteAppointmentController);

module.exports = {
    routes
};