import * as socketio from "socket.io";
import fs from "fs";
import path from 'path';
const io = require("socket.io");

interface StreamStatus {
  video: boolean;
  audio: boolean;
}

// Hold a function type that accept a string (params) and returns nothing (void).
interface CallbackType {
	(data: string | StreamStatus): void;
}

// Associative array type for callbacks.
interface AssociativeType {
	[key: string]: CallbackType;
}

/*

  Controls the streaming from devices (camera + intercom) by handling socket events for obtaining video or audio streams.

*/

class StreamController {

  socketServer: SocketIO.Server | null;
  private broadcastSocketId: string;
  // Stores callbacks to send image data back.
  private imageCallbacks: CallbackType[];
  // Stores callbacks for stream status.
  private streamStatusCallbacks: CallbackType[];
  // Stores callbacks to send face data back.
  private faceCallbacks: AssociativeType;
  // Stores callbacks for motion detection images.
  private motionCallbacks: AssociativeType;

  constructor(){
    this.socketServer = null;
    this.broadcastSocketId = "";
    this.imageCallbacks = [];
    this.streamStatusCallbacks = [];
    this.faceCallbacks = {};
    this.motionCallbacks = {};
  }

  public setSocketServer(socketServer: any) {
    this.socketServer = socketServer;
    if(this.socketServer){
      this.socketServer.sockets.on("connection", this.handleEvents.bind(this));
    }
  }

  private handleEvents(socket: SocketIO.Socket){

    const controller = this;

    // Registers with controller which socket is the one broadcasting media.
    socket.on("stream_broadcaster", () => {
      controller.broadcastSocketId = socket.id;
    });
    // Socket event where a client wants to view the stream, and passes what media they would like to view.
    socket.on("stream_viewer", (constraints: any) => {
      socket.to(controller.broadcastSocketId).emit("stream_viewer", socket.id, constraints);
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
      socket.to(controller.broadcastSocketId).emit("disconnectPeer", socket.id);
    });

    socket.on("send_stream_status", (status: StreamStatus) => {
      for(let i = 0; i < controller.streamStatusCallbacks.length; i++) {
        controller.streamStatusCallbacks[i](status);
      }
      controller.streamStatusCallbacks = [];
    });

    socket.on("receive_recording", (data: any) => {
      const filePath = path.resolve(__dirname, "../output/output.webm");
  		const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
  		fileStream.write(Buffer.from(new Uint8Array(data)));
		});

    socket.on("taken_image", (data: any) => {
      for(let i = 0; i < controller.imageCallbacks.length; i++) {
        controller.imageCallbacks[i](status);
      }
      controller.imageCallbacks = [];
		});

		socket.on("face_image", (data: any) => {
      for (var key in controller.faceCallbacks) {
  			controller.faceCallbacks[key](data);
  		}
		});

    // MOTION DETECTION
		socket.on("motion_detected", (data: any) => {
      for (var key in controller.motionCallbacks) {
  			controller.motionCallbacks[key](data);
  		}
		});

  }

  // ======================================================================================================
  //											STREAM
  // ======================================================================================================

  public getStreamStatus(callback: any) {
    this.streamStatusCallbacks.push(callback);
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("get_stream_status");
    }
  }

  public startStream(constraints: any) {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("start_stream", constraints);
    }
  }

  public stopStream() {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("stop_stream");
    }
  }

  public stopCameraStream() {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("stop_camera_stream");
    }
  }

  public stopIntercomStream() {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("stop_intercom_stream");
    }
  }

  // ======================================================================================================
  //											RECORDING
  // ======================================================================================================

  // Start the recording.
  public startRecording() {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("start_recording");
    }
  }

  // Stop the recording.
  public stopRecording() {
    if(this.socketServer) {
      this.socketServer.to(this.broadcastSocketId).emit("stop_recording");
    }
  }

  // ======================================================================================================
  //											TAKE PICTURE
  // ======================================================================================================

  public getPicture(callback: any) {
		this.imageCallbacks.push(callback);
		if (this.socketServer !== null) {
			this.socketServer.to(this.broadcastSocketId).emit("take_image");
		}
	}

  // ======================================================================================================
  //											MOTION DETECTION
  // ======================================================================================================

  public startMotionDetection() {
		if(this.socketServer !== null) {
			this.socketServer.to(this.broadcastSocketId).emit("start_motion_detection");
		}
	}

	public stopMotionDetection() {
		if(this.socketServer !== null) {
			this.socketServer.to(this.broadcastSocketId).emit("stop_motion_detection");
		}
	}

	public async getMotionData(callback: any, key: string) {
		console.log("Add motion detection callback.");
		this.motionCallbacks[key] = callback;
	}

	public removeMotionCallback(key: string) {
		delete this.motionCallbacks[key];
	}

  // ======================================================================================================
  //											FACIAL RECOGNITION
  // ======================================================================================================

  public startFaceReg() {
		if (this.socketServer !== null) {
			this.socketServer.to(this.broadcastSocketId).emit("start_face_reg");
		}
	}

	public stopFaceReg() {
		if (this.socketServer !== null) {
			this.socketServer.to(this.broadcastSocketId).emit("stop_face_reg");
		}
	}

  public async getFaceData(callback: any, key: string) {
		this.faceCallbacks[key] = callback;
	}

	public removeFaceCallback(key: string) {
		delete this.faceCallbacks[key];
	}

}

export { StreamController };
