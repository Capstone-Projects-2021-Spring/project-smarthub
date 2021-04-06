import express from 'express';
import { spawn } from 'child_process';
import * as socketio from 'socket.io';
import { exec } from 'child_process';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { VideoController } from '../controllers/VideoController';
const youauth = require('youauth');
const { createFolder, uploadVideo, uploadImage } = require('../aws/amazon_s3');

let live_browser: any;
let browserIsLive: boolean = false;
const PORT = 4000;

const OSplatform = process.platform;
const localStoragePath = path.resolve(__dirname, "../output/output.webm");
const imageLocalStoragePath = path.resolve(__dirname, "../output/output.png");

const controller = new VideoController();
const recognizer = new youauth.FaceRecognizer();

async function loadRecognizer() {
	await youauth.loadModels();
}

loadRecognizer();

const routes = express.Router({
	mergeParams: true
});

/*
		Use: Stops the video stream on the pi.
		Params: none
*/
routes.post("/stop_stream", async (req: any, res: any) => {

	console.log("stop_stream route: Stream closing...");

	try {
		await live_browser.close();
	}
	catch (error) {
		console.log("stop_stream route error: " + error);
	}
	finally {
		await live_browser.close();
	}

	console.log("stop_stream route: Stream stopped.");
	return res.status(200).send("Stream Closing.");
});

/*
		Use: Starts the video stream on the pi.
		Params: none
*/
routes.post("/start_stream", (req: any, res: any) => {
	console.log("start_stream route: Stream starting...");
	runLive();
	console.log("start_stream route: Stream started.");
	return res.status(200).send("Stream Starting.");
});

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

	console.log("stop_recording route: Creating folder...");

	await createFolder(accountName, profileName, componentName);

	console.log("stop_recording route: Starting upload to " + localStoragePath);

	await uploadVideo(accountName, profileName, componentName, localStoragePath);

	console.log("stop_recording route: recording stopping...");

	if (OSplatform === 'win32') {
		exec('del ' + localStoragePath);
	}
	else {
		exec('rm ' + localStoragePath);
	}

	console.log("stop_recording_route: cleaned local storage.");

	return res.status(200).send("Recording Stopping.");
});

/*
		Use: Takes a picture of the current video stream, then saves it to a file.
		Params: user_email, profile_name, component_name.
*/
routes.post('/take_image', async (req: any, res: any) => {

	const accountName = req.body.user_email;
	const profileName = req.body.profile_name;
	const componentName = req.body.component_name;

	controller.takingPicture();

	await createFolder(accountName, profileName, componentName);

	console.log("take_image route: Starting upload to " + imageLocalStoragePath);

	await uploadImage(accountName, profileName, componentName, imageLocalStoragePath);

	console.log("take_image route: image taken...");

	if (OSplatform === 'win32') {
		exec('del ' + imageLocalStoragePath);
	}
	else {
		exec('rm ' + imageLocalStoragePath);
	}

	console.log("take_image route: cleaned local storage.");

	return res.status(200).send("Images saved.");
});

/*
		Use: Starts face reg.
		Params: none.
*/
routes.post('/start_face_reg', async (req: any, res: any) => {

	controller.startFaceReg();
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
		Use: Starts the headless chromium browser to utilize WebRTC.
		Params: none
*/
async function runLive() {
	// For now some safety to avoid multiple browser processes open.
	if (!browserIsLive) {
		// The boolean might be slow to update, but front-end can also control access to the route.
		browserIsLive = true;
		// Launch the chromium browser in headless mode.
		live_browser = await puppeteer.launch({
			executablePath: 'chromium-browser',
			headless: true,
			args: ['--use-fake-ui-for-media-stream', '--mute-audio']
		});
		// Create a new page in the browser.
		const page = await live_browser.newPage();

		await page.goto("http://localhost:" + PORT + "/broadcast.html");

		console.log("Chromium is live.");

		live_browser._process.once('close', () => {
			console.log("Browser has closed.");
			browserIsLive = false;
		});
	}
}

// Current face reg functionality. Checks every interval for face data in controller.
setInterval( async () => {
	// Get face data.
	const faceData = await controller.getFaceData();
	// If face data.
	if(faceData.length !== 0) {
		//console.log(faceData.length);
		// Use youauth to detect faces.
		const tensor = await recognizer.loadImage(faceData);
		const detections = await recognizer.detect(tensor);
		console.log(detections);
	}
	// Reset face data to avoid repetitive face data.
	controller.setFaceData("");
}
, 100);

module.exports = {
	routes,
	controller
};
