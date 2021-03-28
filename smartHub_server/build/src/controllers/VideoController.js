"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const io = require("socket.io");
/*

  The videoController class will contain a socket server that handles events from the client side.
  The client side is a web browser that hosts the video stream.
  Communication is established between this class and the client.

*/
class VideoController {
    constructor(httpServer) {
        // Initialize the socket.io server.
        this.socketServer = io(httpServer);
        this.broadcaster = "";
        // Setup server side socket events and bind this instance to the function for access in socket namespace.
        this.socketServer.sockets.on("connection", this.handleEvents.bind(this));
    }
    // Handler for all socket events. Calls their appropriate methods.
    // **** NOTE: Everything is in the scope of the socket. ****
    handleEvents(socket) {
        // This event will be emitted by the broadcaster.
        socket.on("broadcaster", () => {
            this.handleBroadcast(socket);
        });
        // This event will be emitted by the watcher.
        socket.on("watcher", () => {
            this.handleWatch(socket);
        });
        socket.on("offer", (id, message) => {
            this.handleOffer(socket, id, message);
        });
        socket.on("answer", (id, message) => {
            this.handleAnswer(socket, id, message);
        });
        socket.on("candidate", (id, message) => {
            this.handleCandidate(socket, id, message);
        });
        socket.on("receive_recording", (data) => {
            this.handleReceiveRecording(data);
        });
        socket.on("disconnect", () => {
            this.handleDisconnect(socket);
        });
    }
    handleBroadcast(socket) {
        this.broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    }
    handleWatch(socket) {
        socket.to(this.broadcaster).emit("watcher", socket.id);
    }
    handleOffer(socket, id, message) {
        socket.to(id).emit("offer", socket.id, message);
    }
    handleAnswer(socket, id, message) {
        socket.to(id).emit("answer", socket.id, message);
    }
    handleCandidate(socket, id, message) {
        socket.to(id).emit("candidate", socket.id, message);
    }
    handleReceiveRecording(data) {
        const filePath = path_1.default.resolve(__dirname, "../output/output.webm");
        const fileStream = fs_1.default.createWriteStream(filePath, { flags: 'a' });
        fileStream.write(Buffer.from(new Uint8Array(data)));
    }
    handleDisconnect(socket) {
        socket.to(this.broadcaster).emit("disconnectPeer", socket.id);
    }
    // Start the recording.
    startRecording() {
        this.socketServer.to(this.broadcaster).emit("start_recording");
    }
    // Stop the recording.
    stopRecording() {
        this.socketServer.to(this.broadcaster).emit("stop_recording");
    }
}
exports.VideoController = VideoController;
