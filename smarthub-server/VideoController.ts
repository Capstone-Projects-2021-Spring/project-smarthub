import * as socketio from "socket.io";
const io = require("socket.io");

/*

  The videoController class will contain a socket server that handles events from the client side.
  The client side is a web browser that hosts the video stream.
  Communication is established between this class and the client.

*/

class VideoController {

  socketServer: SocketIO.Server;
  private broadcaster: string;

  constructor(httpServer: any){
    // Initialize the socket.io server.
    this.socketServer = io(httpServer, {query: this});
    this.broadcaster = "";
    // Setup server side socket events and bind this instance to the function for access in socket namespace.
    this.socketServer.sockets.on("connection", this.handleEvents.bind(this));
  }

  private handleEvents(socket: SocketIO.Socket){

    socket.on("broadcast", () => {
      this.handleBroadcast(socket);
    });
    socket.on("watch", () => {
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
    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  private handleBroadcast(socket: SocketIO.Socket) {
    this.broadcaster = socket.id;
    socket.broadcast.emit("broadcast");
  }

  private handleWatch(socket: SocketIO.Socket) {
    socket.to(this.broadcaster).emit("watch", socket.id);
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
    socket.to(this.broadcaster).emit("disconnectPeer", socket.id);
  }

}

export { VideoController };
