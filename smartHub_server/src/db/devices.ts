export {};

const knex = require('./connection');

/*
    Use: Adds a device
    Params: device address, device name, device type, user email, profile name
*/
function addDevice(deviceAddress: string, deviceName: string, deviceType: string, profileId: number) {

    return knex("devices")
        .insert({
            device_address: deviceAddress,
            device_name: deviceName,
            device_type: deviceType,
            profile_id: profileId
        })
        .returning("*")
        .then((rows: any) => {
            return rows[0]; 
        });
}

function deleteDevice(deviceId: string) {

    return knex("devices")
        .where("device_id", deviceId)
        .del()
        .then((rows: any) => {
            return rows;
        });
}

function getDevices(profileId: number, deviceType: string) {

    return knex("devices")
        .select("device_id", "device_address", "device_name", "device_type")
        .where(function(this:any) {
            this.where("profile_id", profileId)
            .andWhere("device_type", deviceType);
        })
        .then((devices: any) => {
            return devices;
        });

}

function getDeviceInfo(deviceId: number) {
    return knex({d: "devices"})
        .select("p.profile_id", "device_address", "profile_name", "user_email",)
        .join({p: "profiles"}, "d.profile_id", "=", "p.profile_id")
        .join({u: "users"}, "p.user_id", "=", "u.user_id")
        .where("device_id", deviceId)
        .then((devices: any) => {
            return devices;
        });
}

module.exports = {
    addDevice,
    getDevices,
    getDeviceInfo,
    deleteDevice
}