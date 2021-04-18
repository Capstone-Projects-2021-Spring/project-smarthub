import express from 'express' ;
import http = require("http");
import bodyParser from 'body-parser';
import * as socketio from "socket.io";
import { spawn } from 'child_process';
// const { routes: videoRoutes, controller: videoController } = require('./routes/video_routes');
// const { routes: audioRoutes, controller: audioController } = require('./routes/audio_routes');
const { routes: streamRoutes, controller: streamController } = require('./routes/stream_routes');
const { routes: lockRoutes } = require('./routes/lock_routes');
const { routes: lightRoutes } = require('./routes/light_routes');
const { routes: profileRoutes } = require('./routes/profile_routes');
const { routes: deviceRoutes } = require('./routes/device_routes');
const { routes: faceRoutes } = require('./routes/face_routes');
const { routes: imageRoutes } = require('./routes/image_db_routes');
const { routes: recordingRoutes } = require('./routes/recording_db_routes');
const { routes: awsRoutes } = require('./routes/aws_routes');
const youauth = require('youauth');


async function loadYouAuth() {
	await youauth.loadModels();
}

loadYouAuth();

const app = express();
// Express built-in middleware function static allows serving static files.
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

// Ensure incoming data has json format.
app.use(bodyParser.json({limit: '50mb'}));

//Allows any address to interact with our server
app.use(function (req : any, res : any, next : any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create a http server object from the express application.
const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer);

const PORT = 4000;

streamController.setSocketServer(io);

// videoController.setNameSpace(io);
// audioController.setNameSpace(io);

//Telling express to use the routes found in /video/video_routes.ts (Access these routes by http using /video/startStream, /video/startRecord etc...)
// app.use('/video', videoRoutes);
// app.use('/audio', audioRoutes);
app.use('/stream', streamRoutes);
app.use('/profiles', profileRoutes);
app.use('/devices', deviceRoutes);
app.use('/faces', faceRoutes);
app.use('/images', imageRoutes);
app.use('/recordings', recordingRoutes);
app.use('/lock', lockRoutes);
app.use('/light', lightRoutes);
app.use('/aws', awsRoutes);

async function startBrowser() {
	if(process.platform === 'linux') {
		const browser: any = spawn('chromium-browser', ['--app=', 'http://localhost:4000/main.html']);
		browser.stderr.on('data', (data: any) => {
  		console.error(`stderr: ${data}`);
		});
		browser.on('close', (code: any) => {
  		console.log(`child process exited with code ${code}`);
		});
	}
}

startBrowser();

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
