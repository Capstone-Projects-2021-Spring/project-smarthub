
//Essential modules.
const express = require('express');
const bcrypt = require('bcryptjs');
const pg = require('pg');
const validateRegistration = require('../validation/validateRegistration');
const validateLogin = require('../validation/validateLogin');
const connections = require('../queries/connect');



//Setting up environment variables.
require("dotenv").config();
const envVars = process.env;
const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;

const pgClient = new pg.Client({
    user: envVars.USER,
    host: envVars.HOST,
    database: envVars.DATABASE,
    password: envVars.PASSWORD,
    port: envVars.PORT,
});

const routes = express.Router({
    mergeParams: true
});

routes.get('/', (req, res) => {
    res.status(200).json({msg: "You shouldnt be here..."});
});

routes.post('/login', async (req, res) => {
    
    //Confirming the content of the request body is valid.
    var validatedData = validateLogin(req.body);
    if(validatedData.notValid) {
        return res.status(500).json(validatedData.errors);
    }

    //Connecting to database.
    try {
        await pgClient.connect();   
    } catch (error) {
        console.log("ERRORs: " + error);
    }

    //Check if email exists
    var test1 = await pgClient.query(await connections.getEmail(req.body.email));
    console.log("GET EMAIL: " + test1);
    if(test1.rowCount == 0) {
        console.log("HERE");
        return res.status(500).json({error: "A user with this email does not exist."});
    }

    //Comparing the password in the database with the password entered.
    var test2 = await pgClient.query(await connections.getPassword(req.body.email));
    bcrypt.compare(req.body.password, test2.rows[0].user_password, function(err, result) {
        if(result){
            console.log("HELLO: " + result);
            return res.status(200).json({success: "Login Successful!"});
        }
        else{
            return res.status(400).json({error: "Incorrect password!"});
        }
    });




    
    //validatedData.notValid ? res.status(500).json(validatedData.errors) : res.status(200).json({status: "Success!"});
});

routes.post('/register', async (req, res) => {
        
    //Confirming the content of the request body is valid.
    var validatedData = validateRegistration(req.body);
    if(validatedData.notValid) {
        return res.status(500).json(validatedData.errors);
    }

    //For some reason this password hashing doesnt work below the database connection.
    var saltRounds = 10;
    //This is kind of confusing but the function accepting (err, salt) is a callback that only gets fired after the salt has been generated. https://www.npmjs.com/package/bcrypt
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            //Updating the user password to be the new hash, so we never store the plaintext anywhere.
            req.body.password = hash;
        });
    });

    //Connecting to database.
    try {
        await pgClient.connect();   
    } catch (error) {
        console.log("ERRORs: " + error);
    }

    //If the email already exists in the database, return an error, otherwise add the user to the database.
    var test1 = await pgClient.query(await connections.getEmail(req.body.email));
    if(test1.rowCount != 0) {
        return res.status(500).json({error: "A user with this email aready exists."});
    }
    else {
        
        try {
            var data = await pgClient.query(await connections.addUserQuery(req.body.first_name, req.body.last_name, req.body.email, req.body.password));
        }
        catch(err) {
            console.log("ERRORs: " + err);
        }
        
    }

    validatedData.notValid ? res.status(500).json(validatedData.errors) : res.status(200).json({status: "Success!"});
});

module.exports = {
    routes,
};