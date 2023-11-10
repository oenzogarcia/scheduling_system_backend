const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.listen(process.env.SERVER_EXPRESS_PORT);