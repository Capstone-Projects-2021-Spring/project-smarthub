import * as socketio from "socket.io";
const io = require("socket.io");

interface CallbackType {
	(data: string | boolean): void;
}

/*

  The audioController class will contain a socket server that handles events from the client side.
  The client side is a web browser that hosts the audio stream.
  Communication is established between this class and the client.

*/

class AudioController {

  private namespace: SocketIO.Namespace | null;
  // The socket id of the socket at which the audio channel is first opened.
  private audioOrigin: string;
  // Stores callbacks to send stream status.
	private statusCallbacks: CallbackType[];

  constructor(){
    this.namespace = null;
    this.audioOrigin = "";
    this.statusCallbacks = [];
  }

  // Attach an http server to the socket.io server.
  public setNameSpace(server: SocketIO.Server, namespace: string){
    this.namespace = server.of(namespace);
    // Setup server side socket events and bind this instance to the function for access in socket namespace.
    this.namespace.on("connection", this.handleEvents.bind(this));
  }

  // Handler for all socket events. Calls their appropriate methods.
  // **** NOTE: Everything is in the scope of the socket. ****
  private handleEvents(socket: SocketIO.Socket){

    const controller = this;

    socket.on("audio_origin", () => {
      controller.audioOrigin = socket.id;
      socket.broadcast.emit("audio_origin");
    });

    socket.on("audio_join", () => {
      socket.to(controller.audioOrigin).emit("audio_join", socket.id);
    });

    socket.on("offer", (id: any, description: any) => {
      socket.to(id).emit("offer", socket.id, description);
    });

    socket.on("answer", (id: any, description: any) => {
      socket.to(id).emit("answer", socket.id, description);
    });

    socket.on("candidate", (id: any, candidate: any) => {
      socket.to(id).emit("candidate", socket.id, candidate);
    });

    socket.on("disconnect", () => {
      socket.to(controller.audioOrigin).emit("disconnect_peer", socket.id);
    });

    socket.on("audio_stream_status", (status: boolean) => {
		 	for(let i = 0; i < controller.statusCallbacks.length; i++) {
			 	controller.statusCallbacks[i](status);
		 	}
		 	controller.statusCallbacks = [];
	 	});

  }

  public getStreamStatus(callback: any) {
    this.statusCallbacks.push(callback);
    if(this.namespace !== null) {
      this.namespace.to(this.audioOrigin).emit("get_audio_stream_status");
    }
  }

  public startStream() {
    if(this.namespace !== null) {
      this.namespace.to(this.audioOrigin).emit("start_audio_stream");
    }
  }

  public stopStream() {
    if(this.namespace !== null) {
      this.namespace.to(this.audioOrigin).emit("stop_audio_stream");
    }
  }

}

export { AudioController };
