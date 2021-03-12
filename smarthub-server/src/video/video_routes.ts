import express from 'express' ;
import {spawn} from 'child_process';
import * as socketio from 'socket.io';
import puppeteer from 'puppeteer';
const createFile = require('../aws/amazon_s3').createFile


let live_browser: any;
let recording_browser: any;

const routes = express.Router({
	mergeParams: true
});

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.
routes.post("/stopStream", async (req, res) => {
	await live_browser.close();
});

routes.post("/startStream", (req, res) => {
	console.log("Stream starting");
	runLive();
});

routes.post("/stopRecording", async (req, res) => {
	await live_browser.close();
});

routes.post("/startRecording", (req, res) => {
	runRecording();
});

//-----------------------------------------s3---------------------------------------
//Below will create two folders a users folder (userEmail), sub folder(s) (profiles) and file
//you will not overwrite the folder if you call it again
routes.post("/createS3File", (req : any, res : any) => {
	createFile(req.body.userEmail, req.body.profileName, req.body.fileName);  
})
//--------------------------------------------------------------------------------
  
async function runLive () {
	live_browser = await puppeteer.launch({executablePath: 'chromium-browser', headless: true, args: ['--use-fake-ui-for-media-stream', '--mute-audio'] });
	const page = await live_browser.newPage();
	//WARNING, THIS IS HARD CODED AND IT SHOULDNT BE!, PUT STUFF LIKE PORT IN AN ENVIRONMENT VARIABLE OR SOMETHING SO IT CAN BE UPDATED EVERYWHERE IF ITS CHANGED.
	await page.goto("http://localhost:" + 4000 + "/broadcast.html");
}

async function runRecording () {
	recording_browser = await puppeteer.launch({executablePath: 'chromium-browser', headless: true, args: ['--use-fake-ui-for-media-stream', '--mute-audio'] });
	const page = await recording_browser.newPage();
	//WARNING, THIS IS HARD CODED AND IT SHOULDNT BE!, PUT STUFF LIKE PORT IN AN ENVIRONMENT VARIABLE OR SOMETHING SO IT CAN BE UPDATED EVERYWHERE IF ITS CHANGED.
	await page.goto("http://localhost:" + 4000 + "/record.html");
}


module.exports = {
	routes
};