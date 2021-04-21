export {};

const knex = require('./connection');

/*
    Use: Adds a device
    Params: device address, device name, device type, user email, profile name
*/
function addDevice(deviceAddress: string, deviceName: string, deviceType: string, profileId: number) {
    var config = {
        notifications: false,
        recording: false,
        recordingTime: 5,
        audio: false,
        type: "None"
    };
    return knex("devices")
        .insert({
            device_address: deviceAddress,
            device_name: deviceName,
            device_type: deviceType,
            profile_id: profileId,
            device_config: config
        })
        .returning("*")
        .then((rows: any) => {
            return rows[0];
        });
}

/*
    Use: Deletes a device
    Params: device id
*/
function deleteDevice(deviceId: string) {

    return knex("devices")
        .where("device_id", deviceId)
        .del()
        .then((rows: any) => {
            return rows;
        });
}

/*
    Use: Gets a list of device associated with a profile.
    Params: profile id, device type
*/
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

/*
    Use: Gets information about a device.
    Params: device id
*/
function getDeviceInfo(deviceId: number) {
    return knex({d: "devices"})
        .select("p.profile_id", "u.phone_number", "device_address", "profile_name", "user_email")
        .join({p: "profiles"}, "d.profile_id", "=", "p.profile_id")
        .join({u: "users"}, "p.user_id", "=", "u.user_id")
        .where("device_id", deviceId)
        .then((devices: any) => {
            return devices;
        });
}

/*
    Use: Updates the device configuration for a device.
    Params: device id, config obj
*/
function updateConfig(deviceId: number, config: typeof Object) {
    return knex("devices")
        .where("device_id", deviceId)
        .update({device_config: config})
        .then((device: any) => {
            return device;
        });
}

/*
    Use: Gets the device configuration of a device.
    Params: device id
*/
function getConfig(deviceId: number) {
    return knex("devices")
        .select("device_config")
        .where("device_id", deviceId)
        .then((device: any) => {
            return device[0];
        });
}

module.exports = {
    addDevice,
    getDevices,
    getDeviceInfo,
    deleteDevice,
    updateConfig,
    getConfig
}
