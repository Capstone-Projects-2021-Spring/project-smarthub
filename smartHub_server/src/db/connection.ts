// require('dotenv').config();
// import * as dotenv from 'dotenv'
// const path:string = './.env';
// dotenv.config({path});
const secureEnv = require('secure-env');
process.env = secureEnv({secret: 'SmartHub'});
const envVars = process.env;
// const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;

//require('secure-env')({path:'/custom/path/to/your/env/vars'});

const dbConfig: {
    client: any;
    connection: any;

} = {
    client: 'pg',
    connection: {
        user: envVars.PGUSER,
        host: envVars.PGHOST,
        database: envVars.PGDATABASE,
        password: envVars.PGPASSWORD,
        port: envVars.PGPORT,
    },
};


module.exports = require('knex')(dbConfig);
