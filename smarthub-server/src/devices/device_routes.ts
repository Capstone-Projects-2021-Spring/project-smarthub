import express from 'express' ;
const Devices = require('../db/devices');
const { getProfileID } = require('../db/profiles');

const routes = express.Router({
	mergeParams: true
});

/*
    Use: Adds a device
    Params: device address, device name, device type, profile_id
*/
routes.post("/addDevice", async (req, res) => {
    Devices.addDevice(req.body.device_address, req.body.device_name, req.body.device_type, req.body.profile_id).then((device: any) => {
        if(device) {
            return res.status(200).json(device);
        }
        else {
            return res.status(500).json({message: "Unable to insert device."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });
    
});

routes.post("/deleteDevice", async (req, res) => {

    Devices.deleteDevice(req.body.device_id).then((device: any) => {
        //If the insertion was a success, respond with the device data that was inserted.
        if(device) {
            return res.status(200).json({message: "Device deleted."});
        }
        else {
            return res.status(500).json({message: "Device does not exist(?). Unable to delete device."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });

});

routes.post("/getDevices", async (req, res) => {
	Devices.getDevices(req.body.profile_id, req.body.device_type).then((devices:any) => {
        if(devices) {
            res.status(200).json({devices});
        }
        else {
            return res.status(500).json({message: "Unable to get device."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
});

routes.post("/getDeviceInfo", async (req, res) => {
	Devices.getDeviceInfo(req.body.device_id).then((device:any) => {
        if(device) {
            res.status(200).json({device});
        }
        else {
            return res.status(500).json({message: "Unable to get device."});
        }
    }).catch((err: any) => {
        console.log(err);
        return res.status(500).json({message: err});
    });;
});

module.exports = {
	routes
};