const express = require('express');

const cors = require('cors');
const authRoutes = require('./apps/authentication/routes/authentication.routes');
const { verifyLoggedUser } = require('./apps/authentication/middlewares/auth.middleware');
const specialtyRoutes = require('./apps/specialty/routes/specialty.routes');
const doctorRoutes = require('./apps/doctor/routes/doctor.routes');
const schedulingRoutes = require('./apps/scheduling/routes/scheduling.routes');

const app = express();

app.use(express.json());

app.use(cors());

app.use(authRoutes);

app.use(verifyLoggedUser);

app.use(specialtyRoutes);

app.use(doctorRoutes);

app.use(schedulingRoutes);

module.exports = {
    app
};