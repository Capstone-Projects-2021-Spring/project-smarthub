
import * as socketio from "socket.io";
import fs from "fs";
import path from 'path';
// Fetch the socket.io Server class.
const io = require("socket.io");

/*
  The videoController class will contain a socket server that handles events from the client side.
  The client side is a web browser that hosts the video stream.
  Communication is established between this class and the client.
*/

class VideoController {

  private namespace: SocketIO.Namespace | null;
  // The socket id of the socket at which the audio channel is first opened.
  private broadcaster: string;
  private faceData: string;

  constructor(){
    this.namespace = null;
    this.broadcaster = "";
    this.faceData = "";
  }

  // Attach an http server to the socket.io server.
  public setNameSpace(server: SocketIO.Server){
    this.namespace = server.of('/video');
    // Setup server side socket events and bind this instance to the function for access in socket namespace.
    this.namespace.on("connection", this.handleEvents.bind(this));
  }

  // Handler for all socket events. Calls their appropriate methods.
  // **** NOTE: Everything is in the scope of the socket. ****
  private handleEvents(socket: SocketIO.Socket){
    // This event will be emitted by the broadcaster.
    socket.on("broadcaster", () => {
      this.handleBroadcast(socket);
    });
    // This event will be emitted by the watcher.
    socket.on("watcher", () => {
      this.handleWatch(socket);
    });
    socket.on("offer", (id: any, message: any) => {
      this.handleOffer(socket, id, message);
    });
    socket.on("answer", (id: any, message: any) => {
      this.handleAnswer(socket, id, message);
    });
    socket.on("candidate", (id: any, message: any) => {
      this.handleCandidate(socket, id, message);
    });

    socket.on("receive_recording", (data: any) => {
      this.handleReceiveRecording(data);
    });

    socket.on("handle_images" , (data:any) =>{
      this.handleImages(data);
    });

    socket.on("face_image", (data:any) => {
      this.handleFaceData(data);
    });

    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  private handleBroadcast(socket: SocketIO.Socket) {
    this.broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  }

  private handleWatch(socket: SocketIO.Socket) {
    socket.to(this.broadcaster).emit("watcher", socket.id);
  }

  private handleOffer(socket: SocketIO.Socket, id: any, message: any) {
    socket.to(id).emit("offer", socket.id, message);
  }

  private handleAnswer(socket: SocketIO.Socket, id: any, message: any) {
    socket.to(id).emit("answer", socket.id, message);
  }

  private handleCandidate(socket: SocketIO.Socket, id: any, message: any) {
    socket.to(id).emit("candidate", socket.id, message);
  }

  private handleReceiveRecording(data: any) {
    const filePath = path.resolve(__dirname, "../output/output.webm");
    const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
    fileStream.write(Buffer.from(new Uint8Array(data)));
  }

  private handleImages(data: any){
    // strip off the data: url prefix to get just the base64-encoded bytes
    data = data.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(data ,'base64');
    const filePath = path.resolve(__dirname , "../output/output.png");
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(buf);
  }

  private handleFaceData(data: any) {
    this.faceData = data;
  }

  public async getFaceData() {
    return this.faceData;
  }

  public setFaceData(data: string) {
    this.faceData = data;
  }

  private handleDisconnect(socket: SocketIO.Socket) {
    socket.to(this.broadcaster).emit("disconnectPeer", socket.id);
  }

  // Start the recording.
  public startRecording() {
    if(this.namespace !== null){
      this.namespace.to(this.broadcaster).emit("start_recording");
    }
  }

  // Stop the recording.
  public stopRecording() {
    if(this.namespace !== null){
      this.namespace.to(this.broadcaster).emit("stop_recording");
    }
  }

  // Take a picture of the current stream.
  public takingPicture() {
    if(this.namespace !== null){
      this.namespace.to(this.broadcaster).emit("images");
    }
  }

  public startFaceReg() {
    if(this.namespace !== null){
      this.namespace.to(this.broadcaster).emit("start_face_reg");
    }
  }

  public stopFaceReg() {
    if(this.namespace !== null){
      this.namespace.to(this.broadcaster).emit("stop_face_reg");
    }
  }


}

export { VideoController };
