const express = require('express');
const { createSpecialtyController, listSpecialtiesController, listSpecialtyByIdController, updateSpecialtyController, deleteSpecialtyController } = require('../controllers/specialty.controller');

const specialtyRoutes = new express();

specialtyRoutes.post('/specialty', createSpecialtyController);
specialtyRoutes.get('/specialty', listSpecialtiesController);
specialtyRoutes.get('/specialty/:id', listSpecialtyByIdController);
specialtyRoutes.put('/specialty/:id', updateSpecialtyController);
specialtyRoutes.delete('/specialty/:id', deleteSpecialtyController);

module.exports = specialtyRoutes;