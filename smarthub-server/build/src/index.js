"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = require("http");
const body_parser_1 = __importDefault(require("body-parser"));
const VideoController_1 = require("./controllers/VideoController");
const { routes: videoRoutes } = require('./video/video_routes');
const app = express_1.default();
// Express built-in middleware function static allows serving static files.
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
//Ensure incoming data has json format
app.use(body_parser_1.default.json());
//Allows any address to interact with our server
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Create a http server object from the express application.
const httpServer = http.createServer(app);
const PORT = 4000;
// Create new videoController instance.
const videoController = new VideoController_1.VideoController(httpServer);
//Telling express to use the routes found in /video/video_routes.ts (Access these routes by http using /video/startStream, /video/startRecord etc...)
app.use('/video', videoRoutes);
app.post('/start_recording', (req, res) => {
    videoController.startRecording();
    console.log("start_recording route: recording starting...");
    return res.status(200).json({ message: "start_recording route: recording starting..." });
});
app.post('/stop_recording', (req, res) => {
    videoController.stopRecording();
    console.log("stop_recording route: recording stopping...");
    return res.status(200).json({ message: "stop_recording route: recording stopping..." });
});
httpServer.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
