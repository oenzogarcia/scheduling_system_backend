const express = require('express');
const { registerDoctorController, listDoctorsController, listDoctorByIdController, updateDoctorController, deleteDoctorController } = require('../controllers/doctor.controller');

const doctorRoutes = new express();

doctorRoutes.post('/doctor', registerDoctorController);
doctorRoutes.get('/doctor', listDoctorsController);
doctorRoutes.get('/doctor/:id', listDoctorByIdController);
doctorRoutes.put('/doctor/:id', updateDoctorController);
doctorRoutes.delete('/doctor/:id', deleteDoctorController);

module.exports = doctorRoutes;