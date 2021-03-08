import express from 'express' ;
import {spawn} from 'child_process';
import * as socketio from 'socket.io';
import puppeteer from 'puppeteer';
import { VideoController } from './VideoController';
import path from 'path';
import http = require("http");
import bodyParser from 'body-parser';
const createFolder = require('./public/aws/amazon_s3').createFolder

const app = express();
// Express built-in middleware function static allows serving static files.
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

//Ensure incoming data has json format
app.use(bodyParser.json());

//Allows any address to interact with our server
app.use(function (req : any, res : any, next : any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

//-----------------------------------------s3---------------------------------------

//Below will create two folders a users folder (account) and sub folder(s) (profiles)
app.post("/createS3Folder", (req : any, res : any) => {
    createFolder(req.body.userName, req.body.profileName);  
})

//--------------------------------------------------------------------------------

async function run () {
    browser = await puppeteer.launch({executablePath: 'chromium-browser', headless: true, args: ['--use-fake-ui-for-media-stream', '--mute-audio'] });
    const page = await browser.newPage();
    await page.goto("http://localhost:" + PORT + "/broadcast.html");
}

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
