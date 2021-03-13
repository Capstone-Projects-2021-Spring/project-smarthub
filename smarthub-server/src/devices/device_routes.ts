import express from 'express' ;
import pg from 'pg';

//Setting up environment variables.
require("dotenv").config();
const envVars = process.env;
const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;

//Client configuration stuff.
var config: {
    user: any;
    host: any;
    database: any;
    password: any;
    port: any;
} = {
    user: envVars.USER,
    host: envVars.HOST,
    database: envVars.DATABASE,
    password: envVars.PASSWORD,
    port: envVars.PORT,
}
const pgClient = new pg.Client(config);

const routes = express.Router({
	mergeParams: true
});

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.
routes.post("/addDevice", async (req, res) => {
    //Connecting to database.
    pgClient.connect().then(async response => {
        var query = await pgClient.query("INSERT INTO profile_name, device_ip_address, device_name, device_type, user_email VALUES('" + req.body.profile_name + "', '" + req.body.device_ip_address + "', '" + req.body.device_name + "', '" + req.body.device_type + "', '" + req.body.user_email + "');");
    }).catch(error => console.log("ERROR: " + error));   
	
});

routes.post("/getDevices", async (req, res) => {
	
});

routes.post("/getDeviceAddress", async (req, res) => {
	
});


module.exports = {
	routes
};