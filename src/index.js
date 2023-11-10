const dotenv = require('dotenv');

dotenv.config();

const {app} = require('./server'); 

app.listen(process.env.SERVER_EXPRESS_PORT);


