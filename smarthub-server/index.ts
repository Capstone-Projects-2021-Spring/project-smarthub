import express from 'express';
import {spawn} from 'child_process';
import * as socketio from 'socket.io';
import puppeteer from 'puppeteer';
import { VideoController } from './VideoController';
import path from 'path';
import http = require("http");

const app = express();
// Express built-in middleware function static allows serving static files.
app.use(express.static('public'));
// Create a http server object from the express application.
const httpServer = http.createServer(app);
// Create new videoController instance.
const videoController = new VideoController(httpServer);

let browser: any;

const PORT = 4000;

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.

app.get("/stopStream", async (req, res) => {
  await browser.close();
});

app.get("/startStream", (req, res) => {
  run();
});

async function run () {
    browser = await puppeteer.launch({executablePath: 'chromium-browser', headless: true, args: ['--use-fake-ui-for-media-stream', '--mute-audio'] });
    const page = await browser.newPage();
    await page.goto("http://localhost:" + PORT + "/broadcast.html");
}

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
