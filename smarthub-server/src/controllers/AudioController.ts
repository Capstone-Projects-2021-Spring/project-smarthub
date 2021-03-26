import * as socketio from "socket.io";
const io = require("socket.io");

/*



*/

class AudioController {

  private namespace: SocketIO.Namespace | null;
  // The socket id of the socket at which the audio channel is first opened.
  private audioOrigin: string;

  constructor(){
    this.namespace = null;
    this.audioOrigin = "";
  }

  // Attach an http server to the socket.io server.
  public setNameSpace(server: SocketIO.Server){
    this.namespace = server.of('/audio');
    // Setup server side socket events and bind this instance to the function for access in socket namespace.
    this.namespace.on("connection", this.handleEvents.bind(this));
  }

  // Handler for all socket events. Calls their appropriate methods.
  // **** NOTE: Everything is in the scope of the socket. ****
  private handleEvents(socket: SocketIO.Socket){
    socket.on("audio_origin", () => {
      this.handleOrigin(socket);
    });
    socket.on("audio_join", () => {
      this.handleJoin(socket);
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
    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  private handleOrigin(socket: SocketIO.Socket) {
    this.audioOrigin = socket.id;
    socket.broadcast.emit("audio_origin");
  }

  private handleJoin(socket: SocketIO.Socket) {
    socket.to(this.audioOrigin).emit("audio_join", socket.id);
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

  private handleDisconnect(socket: SocketIO.Socket) {
    socket.to(this.audioOrigin).emit("disconnectPeer", socket.id);
  }
}

export { AudioController };
