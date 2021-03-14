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
        user: envVars.USER,
        host: envVars.HOST,
        database: envVars.DATABASE,
        password: envVars.PASSWORD,
        port: envVars.PORT,
    },
};


module.exports = require('knex')(dbConfig);
