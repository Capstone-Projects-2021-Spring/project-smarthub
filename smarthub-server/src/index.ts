import express from 'express' ;
import path from 'path';
import http = require("http");
import bodyParser from 'body-parser';
import { VideoController } from './controllers/VideoController';
const { routes: videoRoutes } = require('./video/video_routes');
const { routes: profileRoutes } = require('./profiles/profile_routes');

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
app.use('/profiles', profileRoutes);


httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
