import express from 'express';
import { AudioController } from '../controllers/AudioController';
import puppeteer from 'puppeteer-core';

let intercom_browser: any;
let browserIsIntercom: boolean = false;
const PORT = 4000;

const routes = express.Router({
	mergeParams: true
});

const controller = new AudioController();


/*
		Use: Starts the video intercom on the pi.
		Params: none
*/
routes.post("/start_intercom", (req: any, res: any) => {
	console.log("start_intercom route: Intercom starting...");
	runIntercom();
	console.log("start_intercom route: Intercom started.");
	return res.status(200).send("Intercom Starting.");
});

/*
		Use: Stops the video intercom on the pi.
		Params: none
*/
routes.post("/stop_intercom", async (req: any, res: any) => {

	console.log("stop_intercom route: Intercom closing...");

	try {
		await intercom_browser.close();
	}
	catch (error) {
		console.log("stop_intercom route error: " + error);
	}
	finally {
		await intercom_browser.close();
	}

	console.log("stop_intercom route: Intercom stopped.");
	return res.status(200).send("Intercom Closing.");
});

async function runIntercom () {
	// For now some safety to avoid multiple browser processes open.
	if(!browserIsIntercom){
		// The boolean might be slow to update, but front-end can also control access to the route.
		browserIsIntercom = true;
		// Launch the chromium browser in headless mode.
		intercom_browser = await puppeteer.launch({
			executablePath: 'chromium-browser',
			headless: true,
			args: ['--use-fake-ui-for-media-stream'],
			ignoreDefaultArgs:['--mute-audio']
		});
		// Create a new page in the browser.
		const page = await intercom_browser.newPage();
		
		await page.goto("http://localhost:" + PORT + "/audioOrigin.html");

		console.log("Chromium is intercom.");

		intercom_browser._process.once('close', () => {
			console.log("Browser has closed.");
			browserIsIntercom = false;
		});
	}
}

module.exports = {
	routes,
	controller
};