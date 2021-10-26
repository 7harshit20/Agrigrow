const express = require('express');
const app = express();
const config = require('config');


// Connect to database
require('./config/db').getConnection(err => {
    if (err) console.log(err);
    console.log('Connected to database');
})

// if (process.env.NODE_ENV != 'production' && !config.get('database_password')) {
//     console.log('FATAL ERROR: database password not set');
//     process.exit(1);
// }
// if (process.env.NODE_ENV != 'production' && !config.get('private_key')) {
//     console.log('FATAL ERROR: jwt_key not set');
//     process.exit(1);
// }

app.use(express.json());
app.use(require('cors')());
if (process.env.NODE_ENV = 'production') app.use(require('helmet')());
if (process.env.NODE_ENV = 'production') app.use(require('compression')());

app.use('/', require('./routes/signin_signup'));
app.use('/farmer', require('./routes/farmer'));
app.use('/customer', require('./routes/customer'));
app.use('/transporter', require('./routes/transporter'));
const port = 3000;
app.listen(port, () => console.log('Listening on 3000'));