
//Essential modules.
const express = require('express');
const bcrypt = require('bcryptjs');
const validateRegistration = require('../validation/validateRegistration');
const validateLogin = require('../validation/validateLogin');
const User = require('../db/users');


const routes = express.Router({
    mergeParams: true
});

routes.get('/', (req, res) => {
    res.status(200).json({message: "You shouldnt be here..."});
});

routes.post('/login', async (req, res) => {
    
    //Confirming the content of the request body is valid.
    var validatedData = validateLogin(req.body);
    if(validatedData.notValid) {
        return res.status(500).json(validatedData.errors);
    }

    //Check if email exists
    User.getEmail(req.body.email).then((user) => {
        //If the insertion was a success, respond with the profile data that was inserted.
        if(user == undefined) {
            res.status(500).json({message: "A user with that email address does not exist."});
        }
        else {
            //Comparing the password in the database with the password entered.
            User.getPassword(req.body.email).then(password => {
                bcrypt.compare(req.body.password, password, function(err, result) {
                    if(result){  
                        return res.status(200).json({message: "Login Successful!"});
                    }
                    else{
                        return res.status(500).json({message: "Incorrect password!"});
                    }
                });
            }).catch(err => {
                console.log("Error: ", err)
                res.status(500).json({message: err});
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({message: err});
    });

});

routes.post('/register', async (req, res) => {
        
    //Confirming the content of the request body is valid.
    var validatedData = validateRegistration(req.body);
    if(validatedData.notValid) {
        return res.status(500).json(validatedData.errors);
    }

    //Check if email exists
    User.getEmail(req.body.email).then((user) => {
        //If the insertion was a success, respond with the profile data that was inserted.
        if(user != undefined) {
            console.log("THIS SHOsULD BE RUNNING");
            res.status(500).json({message: "A user with that email address already exists."});
        }
        else {
            var saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    User.register(req.body.first_name, req.body.last_name, req.body.email, hash).then((user) => {
                        //If the insertion was a success, respond with the profile data that was inserted.
                        return res.status(200).json(user);
                    }).catch((err) => {
                        console.log(err);
                        return res.status(500).json({message: err});
                    });
                
                });
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({message: err});
    });

});

module.exports = {
    routes,
};