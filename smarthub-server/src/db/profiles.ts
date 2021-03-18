export {};

const knex = require('./connection');

/*
    Use: Adds a new profile.
    Params: users email, profile name.
*/
function addProfile(userEmail: string, profileName: string) {

    return knex("profiles").insert({
            user_email: userEmail,
            profile_name: profileName,
        }).returning("*").then((rows: any) => { return rows[0]; });
}

/*
    Use: Returns all profiles belonging to a user.
    Params: users email
*/
function getProfiles(userEmail: string) {
    return knex("profiles").select("profile_id", "user_email", "profile_name").where("user_email", userEmail).then((rows: any) => {
        return rows;
    });
}

/*
    Use: Returns a profile id belonging to a profile.
    Params: users email, profile name
*/
function getProfileID(userEmail: string, profileName: string) {
    return knex("profiles").select("profile_id").where(function(this:any) {
        this.where("user_email", userEmail).andWhere("profile_name", profileName);
    }).then((row: any) => {
        return row[0];
    });
}

/*
    Use: Deletes a profile.
    Params: users email, profile name
*/
function deleteProfile(profileId: number) {

    return knex("profiles").where("profile_id", profileId).del().then((rows: any) => {
        return rows;
    });
}

module.exports = {
    addProfile,
    getProfiles,
    getProfileID,
    deleteProfile
}