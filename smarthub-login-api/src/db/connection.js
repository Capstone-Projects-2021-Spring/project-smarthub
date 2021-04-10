require('dotenv').config();
const envVars = process.env;
const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;
const dbConfig = {
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