require('dotenv').config();
const envVars = process.env;
const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;
const dbConfig = {
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