
// Connection to PostgreSQL Database using pg module.

const secureEnv = require('secure-env');
process.env = secureEnv({secret: 'SmartHub'});
const envVars = process.env;

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
