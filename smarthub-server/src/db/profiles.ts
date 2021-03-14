const knex = require('./connection');

function addProfile(userEmail: string, profileName: string, deviceAddress: string, deviceName: string, deviceType: string) {

    return knex("profiles").insert({
            user_email: userEmail,
            profile_name: profileName,
            device_address: deviceAddress,
            device_name: deviceName,
            device_type: deviceType
        }).returning("*").then((rows: any) => { return rows[0]; });
}

function deleteProfile(userEmail: string, profileName: string, deviceAddress: string, deviceName: string, deviceType: string) {

    return knex("profiles").where(function(this:any) {
        this.where("user_email", userEmail).andWhere("profile_name", profileName).andWhere("device_type", deviceType);
    }).del().then((rows: any) => {
        return rows;
    });
}

function getProfiles(userEmail: string, profileName: string, deviceType: string) {

    return knex("profiles").select("device_name").where(function(this:any) {
        this.where("user_email", userEmail).andWhere("profile_name", profileName).andWhere("device_type", deviceType);
    }).then((rows: any) => {
        return rows;
    });

}

function getProfileAddress(userEmail: string, profileName: string, deviceName: string, deviceType: string) {

    return knex("profiles").select("device_address").where(function(this:any) {
        this.where("user_email", userEmail).andWhere("profile_name", profileName).andWhere("device_name", deviceName).andWhere("device_type", deviceType);
    }).then((rows: any) => {
        return rows[0];
    });

}


module.exports = {
    addProfile,
    getProfiles,
    getProfileAddress,
    deleteProfile
}