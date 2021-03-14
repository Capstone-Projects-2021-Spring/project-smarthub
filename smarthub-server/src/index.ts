import express from 'express' ;
import path from 'path';
import {exec} from 'child_process';
import http = require("http");
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer-core';
import { VideoController } from './controllers/VideoController';
const { routes: videoRoutes } = require('./video/video_routes');
const createFolder = require('./aws/amazon_s3').createFolder;
const uploadFile = require('./aws/amazon_s3').uploadFile;
const getKeyList = require('./aws/amazon_s3').getKeyList;
const getFile = require('./aws/amazon_s3').getFile;

// Tests on S3 functions.
// getKeyList("test2", "sampleProfile");
// getFile("test2/sampleProfile/vid_Fri_Mar_12_2021_17:25:44_GMT-0500_(Eastern_Standard_Time)");

const OSplatform = process.platform;
const localStoragePath = path.resolve(__dirname, "./output/output.webm");

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

const PORT = 4000;

// Create new videoController instance.
const videoController = new VideoController(httpServer);

//Telling express to use the routes found in /video/video_routes.ts (Access these routes by http using /video/startStream, /video/startRecord etc...)
app.use('/video', videoRoutes);

app.post('/start_recording', (req : any, res : any) => {

  videoController.startRecording();
  console.log("start_recording route: recording starting...");
  return res.status(200).send("Recording Starting.");
});

app.post('/stop_recording', async (req : any, res : any) => {

  const accountName = req.body.user_email;
  const profileName = req.body.profile_name;

  videoController.stopRecording();

  console.log("stop_recording route: Creating folder...");

  await createFolder(accountName, profileName);

  console.log("stop_recording route: Starting upload to " + localStoragePath);

  await uploadFile(accountName, profileName, localStoragePath);

  console.log("stop_recording route: recording stopping...");

  if (OSplatform === 'win32') {
    exec('del ' + localStoragePath);
  }
  else{
    exec('rm ' + localStoragePath);
  }

  console.log("stop_recording_route: cleaned local storage.");

  return res.status(200).send("Recording Stopping.");
});

app.post('/get_file', async (req : any, res : any) => {

  const key = req.body.key;

  console.log("Get File Called. key: " + key);

  const response = await getFile(key);
  return res.status(200).json({ video: response });
});

app.post('/get_key_list', async (req : any, res : any) => {

  const accountName = req.body.user_email;
  const profileName = req.body.profile_name;

  console.log("Get Key List Called. accountName: " + accountName + " profileName: " + profileName);

  const response = await getKeyList(accountName, profileName);

  return res.status(200).json({ keyList: response });
});

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
