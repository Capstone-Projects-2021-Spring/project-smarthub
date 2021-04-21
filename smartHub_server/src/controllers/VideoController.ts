import * as socketio from "socket.io";
import fs from "fs";
import path from 'path';
// Fetch the socket.io Server class.
const io = require("socket.io");

// Hold a function type that accept a string or boolean (params) and returns nothing (void).
interface CallbackType {
	(data: string | boolean): void;
}

// Associative array type for callbacks.
interface AssociativeType {
	[key: string]: CallbackType;
}

/*
	The videoController class will contain a socket server that handles events from the client side.
	The client side is a web browser that hosts the video stream.
	Communication is established between this class and the client.
*/

class VideoController {

	// Holds namespace of socketio server.
	private namespace: SocketIO.Namespace | null;
	// The socket id of the socket at which the video stream is broadcasted from.
	private broadcaster: string;
	// Stores callbacks to send image data back.
	private imageCallbacks: CallbackType[];
	// Stores callbacks to send stream status.
	private statusCallbacks: CallbackType[];
	// Stores callbacks to send face data back.
	private faceCallbacks: AssociativeType;
	// Stores callbacks for motion detections.
	private motionCallbacks: AssociativeType;

	constructor() {
		this.namespace = null;
		this.broadcaster = "";
		this.imageCallbacks = [];
		this.statusCallbacks = [];
		this.faceCallbacks = {};
		this.motionCallbacks = {};
	}

	// Attach an http server to the socket.io server.
	public setNameSpace(server: SocketIO.Server, namespace: string) {
		this.namespace = server.of(namespace);
		// Setup server side socket events and bind this instance to the function for access in socket namespace.
		this.namespace.on("connection", this.handleEvents.bind(this));
	}

	// Handler for all socket events. Calls their appropriate methods.
	// **** NOTE: Everything is in the scope of the socket. ****
	private handleEvents(socket: SocketIO.Socket) {

		const controller = this;

		// This event will be emitted by the broadcaster.
		socket.on("broadcaster", () => {
			controller.broadcaster = socket.id;
			socket.broadcast.emit("broadcaster");
		});

		// This event will be emitted by the watcher.
		socket.on("watcher", () => {
			socket.to(controller.broadcaster).emit("watcher", socket.id);
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
			socket.to(controller.broadcaster).emit("disconnect_peer", socket.id);
		});

		socket.on("video_stream_status", (status: boolean) => {
		 	for(let i = 0; i < controller.statusCallbacks.length; i++) {
			 	controller.statusCallbacks[i](status);
		 	}
		 	controller.statusCallbacks = [];
	 	});

		socket.on("receive_recording", (data: any) => {
			const filePath = path.resolve(__dirname, "../output/output.webm");
			const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
			fileStream.write(Buffer.from(new Uint8Array(data)));
		});

		socket.on("taken_image", (data: any) => {
			for (var i = 0; i < controller.imageCallbacks.length; i++) {
				controller.imageCallbacks[i](data);
			}
			controller.imageCallbacks = [];
		});

		socket.on("face_image", (data: any) => {
			for (var key in controller.faceCallbacks) {
				controller.faceCallbacks[key](data);
			}
		});

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
	 	this.statusCallbacks.push(callback);
	 	if(this.namespace !== null) {
		 	this.namespace.to(this.broadcaster).emit("get_video_stream_status");
	 	}
 	}

	public startStream() {
		if(this.namespace !== null) {
		 	this.namespace.to(this.broadcaster).emit("start_video_stream");
	 	}
	}

	public stopStream() {
		if(this.namespace !== null) {
		 	this.namespace.to(this.broadcaster).emit("stop_video_stream");
	 	}
	}

	// ======================================================================================================
	//											RECORDING
	// ======================================================================================================

	// Start the recording.
	public startRecording() {
		if (this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("start_recording");
		}
	}

	// Stop the recording.
	public stopRecording() {
		if (this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("stop_recording");
		}
	}

	// ======================================================================================================
	//											TAKE IMAGE
	// ======================================================================================================

	public getPicture(callback: any) {
		this.imageCallbacks.push(callback);
		if (this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("take_image");
		}
	}

	// ======================================================================================================
	//											FACIAL RECOGNITION
	// ======================================================================================================

	public async getFaceData(callback: any, key: string) {
		this.faceCallbacks[key] = callback;
	}

	public removeFaceCallback(key: string) {
		delete this.faceCallbacks[key];
	}

	public startFaceReg() {
		if (this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("start_face_reg");
		}
	}

	public stopFaceReg() {
		if (this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("stop_face_reg");
		}
	}

	// ======================================================================================================
	//											MOTION DETECTION
	// ======================================================================================================

	public startMotionDetection() {
		if(this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("start_motion_detection");
		}
	}

	public stopMotionDetection() {
		if(this.namespace !== null) {
			this.namespace.to(this.broadcaster).emit("stop_motion_detection");
		}
	}

	public async getMotionData(callback: any, key: string) {
		this.motionCallbacks[key] = callback;
	}

	public removeMotionCallback(key: string) {
		delete this.motionCallbacks[key];
	}

}

export { VideoController };
