const express = require('express');
const { scheduleAppointmentController, listAppointmentsController, listAppointmentByIdController, updateAppointmentDateController, updateAppointmentPersonalInfoController, deleteAppointmentController } = require('../controllers/scheduling.controller');

const schedulingRoutes = new express();

schedulingRoutes.post('/scheduling/schedule', scheduleAppointmentController);
schedulingRoutes.get('/scheduling/list', listAppointmentsController);
schedulingRoutes.get('/scheduling/list/:id', listAppointmentByIdController);
schedulingRoutes.put('/scheduling/:id/update/date', updateAppointmentDateController);
schedulingRoutes.put('/scheduling/:id/update/info', updateAppointmentPersonalInfoController);
schedulingRoutes.delete('/scheduling/:id/delete', deleteAppointmentController);

module.exports = schedulingRoutes;
