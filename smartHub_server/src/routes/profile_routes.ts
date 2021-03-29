import express from 'express' ;
const Profiles = require('../db/profiles');

const routes = express.Router({
	mergeParams: true
});

/*
    Use: Adds a profile.
    Params: users email, profile name
*/
routes.post("/addProfile", async (req, res) => {
    
    Profiles.addProfile(req.body.user_id, req.body.profile_name).then((profile: any) => {
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

/*
    Use: Returns all profiles belonging to a user.
    Params: users email
*/
routes.post("/getProfiles", async (req, res) => {
	Profiles.getProfiles(req.body.user_id).then((profiles:any) => {
        if(profiles.length != 0) {
            res.status(200).json({profiles});
        }
        else {
            return res.status(500).json({message: "No profiles found."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
});

/*
    Use: Returns a profile id belonging to a profile.
    Params: users email, profile name
    --below is not needed for profiles
*/
// routes.post("/getProfileID", async (req, res) => {
// 	Profiles.getProfileID(req.body.user_email, req.body.profile_name).then((profile:any) => {
//         console.log(profile)
//         if(profile) {
//             res.status(200).json({profile});
//         }
//         else {
//             return res.status(500).json({message: "No profile found."});
//         }
//     }).catch((err: any) => {
//         console.log(err);
//         return res.status(500).json({message: err});
//     });;
// });

/*
    Use: Deletes a profile.
    Params: profile_id
*/

routes.post("/getUserInfo" , async (req, res) => {
    Profiles.getUserInfo(req.body.user_id).then((profiles:any) => {
        if(profiles.length != 0) {
            res.status(200).json({profiles});
        }
        else {
            return res.status(500).json({message: "No profiles found."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
})
routes.post("/deleteProfile", async (req, res) => {

    Profiles.deleteProfile(req.body.profile_id).then((profile: any) => {
        //If the insertion was a success, respond with the profile data that was inserted.
        if(profile) {
            return res.status(200).json({message: "Profile deleted."});
        }
        else {
            return res.status(500).json({message: "Profile does not exist(?). Unable to delete profile."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });

});

module.exports = {
	routes
};