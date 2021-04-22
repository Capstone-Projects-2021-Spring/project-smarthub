import express from 'express';
import { spawn } from 'child_process';
import * as socketio from 'socket.io';
import { exec } from 'child_process';
import path from 'path';
import { VideoController } from '../controllers/VideoController';
const Faces = require('../db/faces');
const Images = require('../db/images');
const Devices = require('../db/devices');
const Recordings = require('../db/recordings');
const youauth = require('youauth');
const { createFolder, storeImage, storeRecording, generateSignedURL } = require('../aws/amazon_s3');
const { sendSMS } = require('../notifications/twilioPushNotification');
import { v4 as uuidv4 } from 'uuid';

const localStoragePath = path.resolve(__dirname, "../output/output.webm");
const controller = new VideoController();
const recognizer = new youauth.FaceRecognizer();

let nextCallTime: Date = new Date(-8640000000000000);

const routes = express.Router({
	mergeParams: true
});

// ======================================================================================================
//											STREAM
// ======================================================================================================


/*
		Use: Starts the video stream on the pi.
		Params: none
*/
routes.post("/start_stream", (req: any, res: any) => {

	console.log("start_stream route: video stream starting...");
	controller.startStream();
	return res.status(200).send("Stream Starting.");
});

/*
		Use: Stops the video stream on the pi.
		Params: none
*/
routes.post("/stop_stream", async (req: any, res: any) => {

	console.log("stop_stream route: video stream closing...")
	controller.stopStream();
	return res.status(200).send("Stream Closing.");
});


/*
		Use: Checks the video stream status.
		Params: none
*/
routes.post("/stream_check", (req: any, res: any) => {

	controller.getStreamStatus( (status: boolean) => {
		if(status) {
			return res.status(200).send({ message: "The stream is already live", streaming: status });
		}
		else {
			return res.status(200).send({ message: "The stream is not live", streaming: status });
		}
	});

});

// ======================================================================================================
//											RECORDING
// ======================================================================================================

/*
		Use: Starts recording on the video stream.
		Params: none
*/
routes.post('/start_recording', (req: any, res: any) => {

	controller.startRecording();
	console.log("start_recording route: recording starting...");
	return res.status(200).send("Recording Starting.");
});

/*
		Use: Stops recording and upload file to S3.
		Params: user_email, profile_name, component_name.
*/
routes.post('/stop_recording', async (req: any, res: any) => {

	const accountName = req.body.user_email;
	const profileName = req.body.profile_name;
	const componentName = req.body.component_name;

	controller.stopRecording();

	await createFolder(accountName, profileName, componentName);

	console.log("stop_recording route: Starting upload to " + localStoragePath);

	await storeRecording(accountName, profileName, componentName, localStoragePath);

	console.log("stop_recording route: recording stopping...");

	deleteLocalFile(localStoragePath);

	console.log("stop_recording_route: cleaned local storage.");

	return res.status(200).send("Recording Stopping.");
});

// ======================================================================================================
//											TAKE PICTURE
// ======================================================================================================

/*
		Use: Takes a picture of the current video stream, then stores the dataURI in the S3.
		Params: user_email, profile_name, component_name.
*/
routes.post('/take_image', async (req: any, res: any) => {

	const accountName = req.body.user_email;
	const profileName = req.body.profile_name;
	const componentName = req.body.component_name;

	controller.getPicture( async (data: any) => {

		await createFolder(accountName, profileName, componentName);
		console.log("take_image route: Uploading Image.");
		await storeImage(accountName, profileName, componentName, data);

		return res.status(200).send("Image saved.");
	});

});

// ======================================================================================================
//											FACIAL RECOGNITION
// ======================================================================================================

/*
		Use: Takes a picture of the current video stream and try to use it as a face image.
		Params: user_email, profile_name, component_name, profile_id, image_name
*/
routes.post("/takeFaceImage", async (req: any, res: any) => {

	// Request body parameters for storage in database and S3.
	const profileId: number = req.body.profile_id;
	const accountName: string = req.body.user_email;
	const profileName: string = req.body.profile_name;
	const componentName: string = req.body.component_name;
	const imageName: string = req.body.image_name;

	// Initiate a callback on controller to fetch image of current video stream.
	controller.getPicture( async (dataURI: string) => {
		// Use API to convert dataURI into a tensor object.
		const tensor = await recognizer.loadImage(dataURI);
		// Use API to detect faces in the tensor object.
		const detections = await recognizer.detect(tensor);
		if (detections.length === 0) {
			return res.status(500).send("No faces detected!");
		}
		else if (detections.length !== 1) {
			return res.status(500).send("Too many faces detected!");
		}

		// Build two arrays, one to store dataURI, the other to label the dataURI.
		const refImages = [dataURI];
		const labels = [imageName];
		// Create a LabeledFaceDescriptors object. Contains face descriptors with associated labels or names.
		const labeledFaceDescriptors = await recognizer.labelDescriptors(labels, refImages);

		// Add image face data to faces table in database.
		Faces.addFace(imageName, JSON.stringify(labeledFaceDescriptors), profileId).then((face: any) => {
			if (!face) {
				return res.status(500).json({ message: "Unable to insert face." });
			}
		}).catch((err: any) => {
			console.log(err);
			return res.status(500).json({ message: err });
		});
		// Store the image in the S3.
		const obj = await storeImage(accountName, profileName, componentName, dataURI);
		// Get the generated signed URL for accessing the image from the S3.
		const imageLink = await generateSignedURL(obj.key);
		// Add to images table in the database. Image type is 1 to indicate a UPLOADED_FACE_REG.
		Images.addImage(imageName, imageLink, 1, obj.key, profileId).then((image: any) => {
			if (!image) {
				return res.status(500).json({ message: "Unable to insert image." });
			}
		}).catch((err: any) => {
			console.log(err);
			return res.status(500).json({ message: err });
		});

		return res.status(200).send("Face Capture Successful!");

	});

});

/*
		Use: Starts face reg.
		Params: profile_id.
*/
routes.post('/start_face_reg', async (req: any, res: any) => {

	// Request body parameters for storage in database and S3, and also device/user information.
	const profileId: number = req.body.profile_id;
	const accountName: string = req.body.user_email;
	const profileName: string = req.body.profile_name;
	const componentName: string = req.body.component_name;
	const deviceId: number = req.body.device_id;
	const phoneNumber: string = req.body.phone_number;

	// Use the controller to signal to browser to start sending images to server at a certain interval.
	controller.startFaceReg();
	console.log("Start facial recognition route.");

	// Fetch all recognized faces associated with the user profile id.
	Faces.getFaces(profileId).then((faces: any) => {

		let labeledFaceDescriptors: any = [];

		const objList: any = parseFacesData(faces);

		if (objList.length !== 0) {
			labeledFaceDescriptors = recognizer.loadDescriptors(objList);
		}

		getDetections(function (detections: any, tensor: any) {

			let matches: any = [];
			let matchedLabels: any = [];

			// If there are faces to detect.
			if(labeledFaceDescriptors.length !== 0) {
					matches = recognizer.getMatches(detections, labeledFaceDescriptors);
					matchedLabels = recognizer.getMatchedLabels(matches);
			}

			const currentCallTime: Date = new Date();
			if(currentCallTime >= nextCallTime) {
				processDetections( {
					"matches": matches,
					"matchedLabels": matchedLabels,
					"detections": detections,
					"image": tensor,
					"profileId": profileId,
					"accountName": accountName,
					"profileName": profileName,
					"componentName": componentName,
					"phoneNumber": phoneNumber,
					"deviceId": deviceId
				});
				nextCallTime = new Date(currentCallTime.getTime() + 1 * 60000);
			}

		}, profileId);

	}).catch((err: any) => {
		console.log(err);
		return res.status(500).json({ message: err });
	});

	return res.status(200).send("Face Recognition Started.");
});

/*
		Use: Stops face reg.
		Params: none.
*/
routes.post('/stop_face_reg', async (req: any, res: any) => {

	controller.stopFaceReg();

	return res.status(200).send("Face Recognition Stopped.");
});

/*
		Use: Stops face reg for a specific profile.
		Params: profile_id.
*/
routes.post('/stop_face_reg_profile', async (req: any, res: any) => {

	const profileId: number = req.body.profile_id;

	controller.removeFaceCallback(profileId + "");

	return res.status(200).send("Face Recognition Stopped for Profile.");
});

/*
		Use: Processes and analyzes detected faces and any matches made.
*/
async function processDetections (params: any) {
	// Fetch the device config for the specified device.
	const deviceConfig: any = await Devices.getConfig(params.deviceId);
	// Draw the detections on the tensor object, and get the dataURI back.
	const dataURI = await recognizer.drawFaceDetections(params.matches, params.detections, params.image, true);
	// Default name for image of face detection is a timestamp. Low chance of duplicate name due to the interval at which faces are checked.
	const defaultName: string = "face_detect_" + new Date();
	// Store image in the S3.
	const obj = await storeImage(params.accountName, params.profileName, params.componentName, dataURI);
	// Fetch signed URL.
	const imageLink = await generateSignedURL(obj.key);
	// Add to database. Image type 2 is DETECTED_FACE_REG.
	const response = await Images.addImage(defaultName, imageLink, 2, obj.key, params.profileId);
	// Show unknown face(s) if no matches were found.
	const message = params.matchedLabels.toString() || "unknown face(s)";

	// If notifications are enabled, send a message to the user's registered phone number.
	if(deviceConfig.device_config.notifications) {
		sendSMS({
			messageBody: "smartHub image: Face(s) Detected! - " + message,
			phoneNumber: params.phoneNumber,
			mediaContent: imageLink
		});
	}

	// If recording is enabled in configs. Record for the set amount of seconds.
	if(deviceConfig.device_config.recording) {
		controller.startRecording();

		setTimeout( async () => {

			controller.stopRecording();
			const obj = await storeRecording(params.accountName, params.profileName, params.componentName, localStoragePath);
			deleteLocalFile(localStoragePath);

			const recordingLink = await generateSignedURL(obj.key);

			const response = await Recordings.addRecording(recordingLink, 1, obj.key, params.profileId);

			sendSMS({
				messageBody: "smartHub new recording available: Face(s) Detected! - " + message,
				phoneNumber: params.phoneNumber
			});

		}, deviceConfig.device_config.recordingTime * 1000 );

	}

}

// Function that starts continous fetching of face images from controller.
function getDetections(callback: any, profileId: number) {

	// Create a callback function that the controller calls back when an image is available.
	const newCallback = async function processFaceImage(faceImage: any) {
		// Detect faces from the image.
		const tensor = await recognizer.loadImage(faceImage);
		const detections = await recognizer.detect(tensor);
		// If faces are detected, callback to the start face reg rout with the detections.
		if (detections.length !== 0) callback(detections, tensor);
	}
	// Initiate a callback during a set interval for images.
	controller.getFaceData(newCallback, profileId + "");
}

// Function just for parsing the array passed
function parseFacesData(faces: any) {
	const objList: any = [];
	for (var i = 0; i < faces.length; i++) {
		objList[i] = faces[i].face_data[0];
	}
	return objList;
}

// =======================================================================================================
// 												MOTION DETECTION
// =======================================================================================================

/*
		Use: Starts motion detection for the specific profile.
		Params: profile_id, user_email, profile_name, component_name, device_id, phone_number.
*/
routes.post('/start_motion_detection', async (req: any, res: any) => {

	const profileId: number = req.body.profile_id;
	const accountName: string = req.body.user_email;
	const profileName: string = req.body.profile_name;
	const componentName: string = req.body.component_name;
	const deviceId: number = req.body.device_id;
	const phoneNumber: string = req.body.phone_number;

	controller.startMotionDetection();

	const deviceConfig: any = await Devices.getConfig(deviceId);

	console.log("Start motion detection route.");
	controller.getMotionData(async function (data: any) {

		// console.log("Hey, motion was detected :) ");
		// console.log(accountName);
		// console.log(componentName);
		// console.log(profileName);

		const defaultName: string = "motion_detect_" + new Date();

		const obj = await storeImage(accountName, profileName, componentName, data);

		const imageLink = await generateSignedURL(obj.key);
		// Image type 3 is DETECTED_MOTION
		const response = await Images.addImage(defaultName, imageLink, 3, obj.key, profileId);

		if (deviceConfig.device_config.notifications) {
			sendSMS({
				messageBody: "smartHub image: Motion Detected!",
				phoneNumber: phoneNumber,
				mediaContent: imageLink
			});
		}

		if (deviceConfig.device_config.recording) {

			controller.startRecording();

			setTimeout(async () => {

				controller.stopRecording();
				const obj = await storeRecording(accountName, profileName, componentName, localStoragePath);
				deleteLocalFile(localStoragePath);

				const recordingLink = await generateSignedURL(obj.key);

				const response = await Recordings.addRecording(recordingLink, 2, obj.key, profileId);

				sendSMS({
					messageBody: "smartHub new recording available: Motion Detected!",
					phoneNumber: phoneNumber
				});

			}, deviceConfig.device_config.recordingTime * 1000);
		}

	}, profileId + "");

	return res.status(200).send("Motion Detection Started.");
});

/*
		Use: Stops motion detection.
		Params: None.
*/
routes.post('/stop_motion_detection', async (req: any, res: any) => {

	controller.stopMotionDetection();

	return res.status(200).send("Motion Detection Stopped.");
});

// ======================================================================================================
//											HELPER FUNCTIONS
// ======================================================================================================


// Function for deleting a local media file.
function deleteLocalFile(path: string) {
	if (process.platform === 'win32') {
		exec('del ' + path);
	}
	else {
		exec('rm ' + path);
	}
}

module.exports = {
	routes,
	controller
};
