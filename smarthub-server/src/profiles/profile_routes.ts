import express from 'express' ;
const Profiles = require('../db/profiles');

//Setting up environment variables.
// require("dotenv").config();
// const envVars = process.env;
// const { USER, HOST, DATABASE, PASSWORD, PORT} = envVars;


const routes = express.Router({
	mergeParams: true
});

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.
routes.post("/addProfile", async (req, res) => {

    Profiles.addProfile(req.body.user_email, req.body.profile_name, req.body.device_address, req.body.device_name, req.body.device_type).then((profile: any) => {
        //If the insertion was a success, respond with the profile data that was inserted.
        if(profile) {
            return res.status(200).json(profile);
        }
        else {
            return res.status(500).json({message: "Unable to insert profile."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });

});

routes.post("/getProfiles", async (req, res) => {
	Profiles.getProfiles(req.body.user_email, req.body.profile_name, req.body.device_type).then((profiles:any) => {
        if(profiles) {
            res.status(200).json({profiles});
        }
        else {
            return res.status(500).json({message: "Unable to get profile."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
});

routes.post("/getProfileAddress", async (req, res) => {
	Profiles.getProfileAddress(req.body.user_email, req.body.profile_name, req.body.device_type).then((profile:any) => {
        if(profile) {
            res.status(200).json({profile});
        }
        else {
            return res.status(500).json({message: "Unable to get profile."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
});



module.exports = {
	routes
};