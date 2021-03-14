import express from 'express';
import {spawn} from 'child_process';
import * as socketio from 'socket.io';
import puppeteer from 'puppeteer-core';

let live_browser: any;
let recording_browser: any;
let browserIsLive: boolean = false;
const PORT = 4000;

const routes = express.Router({
	mergeParams: true
});

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.
routes.post("/stop_stream", async (req: any, res: any) => {

	console.log("stop_stream route: Stream closing...");

	try{
		await live_browser.close();
	}
	catch (error) {
		console.log("stop_stream route error: " + error);
	}
	finally{
		await live_browser.close();
	}

	console.log("stop_stream route: Stream stopped.");
	return res.status(200).send("Stream Closing.");
});

routes.post("/start_stream", (req: any, res: any) => {
	console.log("start_stream route: Stream starting...");
	runLive();
	console.log("start_stream route: Stream started.");
	return res.status(200).send("Stream Starting.");
});

//-----------------------------------------s3---------------------------------------

//Below will create two folders a users folder (account) and sub folder(s) (profiles)
// routes.post("/createS3Folder", (req : any, res : any) => {
// 	createFolder(req.body.userName, req.body.profileName);
// })

//--------------------------------------------------------------------------------

async function runLive () {
	// For now some safety to avoid multiple browser processes open.
	if(!browserIsLive){
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
		//WARNING, THIS IS HARD CODED AND IT SHOULDNT BE!, PUT STUFF LIKE PORT IN AN ENVIRONMENT VARIABLE OR SOMETHING SO IT CAN BE UPDATED EVERYWHERE IF ITS CHANGED.
		await page.goto("http://localhost:" + PORT + "/broadcast.html");

		console.log("Chromium is live.");

		live_browser._process.once('close', () => {
			console.log("Browser has closed.");
			browserIsLive = false;
		});
	}
}

module.exports = {
	routes
};
