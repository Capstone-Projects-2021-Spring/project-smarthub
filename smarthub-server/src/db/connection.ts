require('dotenv').config();
import * as dotenv from 'dotenv'
const path:string = './.env';
dotenv.config({path});
const envVars = process.env;
const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;

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
