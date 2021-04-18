
'use strict';

/*
 *  Object for holding RTCPeerConnection objects. Stored as key:value pairs.
 *  Key is the socket id, value is the RTCPeerConnection object.
 */
const peerConnections = {};
// Socket that connects to origin of the current URL.
const socket = io.connect(window.location.origin);

window.onunload = window.onbeforeunload = () => {
	socket.close();
};

const localVideo = document.getElementById("localVideo");
const localAudio = document.getElementById("localAudio");
const remoteAudio = document.getElementById("remoteAudio");

let mediaRecorder;
let faceRegInterval;
const canvas = document.getElementById("canvas");
const photos = document.getElementById("photoOutput");
const photoButton = document.getElementById("photoButton");

// ------------------------- Start of Configuration Options. -------------------------

/*
 * Configuration for RTC peer connections. STUN and TURN servers.
 * STUN for identifying public ip address.
 * TURN for NAT traversal (getting pass firewalls).
 * Currently uses google's public STUN servers.
 * The WebRTC connection here is on localhost, no HTTPS required for device permissions.
 */
const config = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302',
		},
		{
			urls: 'stun:stun1.l.google.com:19302',
		},
		{
			urls: 'stun:stun2.l.google.com:19302',
		},
	]
};

let width = 320;
let height = 320;

// ------------------------- End of Configuration Options. -------------------------



// ----------------------------------------- RTC Peer Socket Events ---------------------------------------

socket.on("stream_viewer", (id, constraints) => {

	// id: The id of the socket (connected to the same server) that is requesting to view the stream.
	// constraints: What media types to capture locally (video, audio, both).

	// If peerConnection with this socket id already exists, create new peerConnection after closing old one.
	if(peerConnections[id] !== undefined){
		console.log("Restarting existing peer connection!");
		peerConnections[id].close();
		delete peerConnections[id];
	}

	// If video is requested.
	if(constraints.video) {
		console.log("Video is requested!");
		// If there is no existing local video stream. Get video(or audio), then make new peer connection.
		if(!localVideo.srcObject) {
			init(constraints, function () {
				setUpPeerConnection(id, localVideo.srcObject);
			});
		}
		else {
			console.log("Video stream already on!");
			setUpPeerConnection(id, localVideo.srcObject);
		}
	}
	// If only audio is requested.
	else if(constraints.audio) {
		console.log("Video is not requested!");
		// If there is no existing local audio stream. Get audio, then make new peer connection.
		if(!localAudio.srcObject) {
			init(constraints, function () {
				setUpPeerConnection(id, localAudio.srcObject);
			});
		}
		else {
			console.log("Audio stream is already on!");
			setUpPeerConnection(id, localAudio.srcObject);
		}
	}

});

function setUpPeerConnection(id, stream, clientAudio) {

	const peerConnection = new RTCPeerConnection(config);
	peerConnections[id] = peerConnection;

	// Add tracks to peer connection.
	stream.getTracks().forEach( track =>
		peerConnection.addTrack(track, stream)
	);

	peerConnection.ontrack = event => {
			console.log("Getting client audio!");
			remoteAudio.srcObject = new MediaStream(event.streams[0].getAudioTracks());
	};

	// Create new SDP Offer.
	peerConnection.createOffer()
		// Set the local description to this offer.
		.then(sdp => peerConnection.setLocalDescription(sdp))
		.then(() => {
			// Send it the sender.
			socket.emit("offer", id, peerConnection.localDescription);
		});

	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			socket.emit("candidate", id, event.candidate);
		}
	};

}

// On receiving an answer, set the remote description to the local description received.
socket.on("answer", (id, description) => {
	peerConnections[id].setRemoteDescription(description);
});

// Exchange of ICE candidates.
socket.on("candidate", (id, candidate) => {
	if(peerConnections[id]){
		peerConnections[id]
			.addIceCandidate(new RTCIceCandidate(candidate))
			.catch(e => console.error(e));
	}
});

socket.on("disconnectPeer", id => {
	console.log("A peer has disconnected!");
	peerConnections[id].close();
	delete peerConnections[id];
});

// ----------------------------------------- End Of RTC Peer Socket Events ---------------------------------------



// ----------------------------------------- Start Of Stream Socket Events ---------------------------------------

socket.on("start_stream", async (constraints) => {
	init(constraints);
});

socket.on("stop_stream", () => {
	stopStream();
});

socket.on("get_stream_status", () => {

	let streamStatus = {
		video: false,
		audio: false
	};

	// If there is local video.
	if(localVideo.srcObject){
		streamStatus.video = true;
	}
	// If there is local audio.
	if(localAudio.srcObject){
		streamStatus.audio = true;
	}

	socket.emit("send_stream_status", streamStatus);
});

socket.on("start_recording", id => {
	startRecording();
});

socket.on("stop_recording", id => {
	stopRecording();
});

socket.on("take_image", () => {
	takePicture();
});

socket.on("stop_face_reg", async () => {
	await stopFaceReg();
});

socket.on("start_face_reg", async () => {
	await startFaceReg();
});

socket.on("start_motion_detection", async () => {
	await startMotionDetection();
});

socket.on("stop_motion_detection", async () => {
	await stopMotionDetection();
});

// ----------------------------------------- End Of Stream Socket Events ---------------------------------------



// ----------------------------------------- Start Of Functions ---------------------------------------

// ======================================================================================================
//											STREAM
// ======================================================================================================

// Capture video or audio or both.
async function init(constraints, callback) {

	console.log("Stream Starting!");

  try{
    navigator.mediaDevices.getUserMedia(constraints).then( (stream) => {

			// If video is requested then update localVideo. Video tag is capable of capturing both video and audio.
			if(constraints.video){
				// The stream is guaranteed to have video tracks, but not audio.
				localVideo.srcObject = stream;
			}
			// If only audio is requested then update localAudio. Audio tag only capture audio.
			else if(constraints.audio){
				// The stream is guaranteed to have audio tracks.
				localAudio.srcObject = stream;
			}

			callback();

    }).catch( (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }

}

function stopStream() {
	localVideo.srcObject = null;
	localAudio.srcObject = null;
	remoteAudio.srcObject = null;
	for(let i = 0; i < peerConnections.length; i++) {
		peerConnections[i].close();
	}
	peerConnections = {};
}

// WIP
function stopCameraStream() {
	localVideo.srcObject = null;
}

// WIP
function stopIntercomStream() {
	localAudio.srcObject = null;
	remoteAudio.srcObject = null;
}

// ======================================================================================================
//											TAKE PICTURE
// ======================================================================================================

photoButton.addEventListener('click', function (e) {
	takePicture();
	e.preventDefault();
}, false);

//take picture from canvas
function takePicture() {
	//create canvas
	const context = canvas.getContext('2d');
	//set canvas props
	canvas.width = width;
	canvas.height = height;
	//draw image of the video on the canvas
	context.drawImage(localVideo, 0, 0, width, height);
	//create image from canvas
	const imgURL = canvas.toDataURL('image/png');
	//create img element
	const img = document.createElement('img');
	//set image source
	img.setAttribute('src', imgURL);
	//add img to photos
	photos.src = imgURL;
	//console.log(photos);
	handleImages(imgURL);
}

function handleImages(data) {
	console.log(data.length);
	socket.emit("taken_image", data);
}

// ======================================================================================================
//											RECORDING
// ======================================================================================================

function startRecording() {

	let options = { mimeType: 'video/webm;codecs=vp9,opus' };
	if (!MediaRecorder.isTypeSupported(options.mimeType)) {
		console.error(`${options.mimeType} is not supported`);
		options = { mimeType: 'video/webm;codecs=vp8,opus' };
		if (!MediaRecorder.isTypeSupported(options.mimeType)) {
			console.error(`${options.mimeType} is not supported`);
			options = { mimeType: 'video/webm' };
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				console.error(`${options.mimeType} is not supported`);
				options = { mimeType: '' };
			}
		}
	}

	try {
		mediaRecorder = new MediaRecorder(localVideo.srcObject, options);
	}
	catch (e) {
		console.error('Exception while creating MediaRecorder:', e);
		return;
	}

	mediaRecorder.onstop = (event) => {
		console.log('Recorder stopped: ', event);
	};

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(1000);
}

function handleDataAvailable(event) {
	console.log('handleDataAvailable', event);
	if (event.data && event.data.size > 0) {
		socket.emit("receive_recording", event.data);
	}
}

function stopRecording() {
	mediaRecorder.stop();
}

// ======================================================================================================
//											FACIAL RECOGNITION
// ======================================================================================================

// Starts face reg.
async function startFaceReg() {

  const videoCanvas = document.createElement("canvas");
  videoCanvas.width = 320;
  videoCanvas.height = 320;

  if(!faceRegInterval) {
      faceRegInterval = setInterval( async () => {
          const context = videoCanvas.getContext("2d");
          context.drawImage(localVideo, 0, 0);
          socket.emit("face_image", videoCanvas.toDataURL());
      }, 5000);
  }
}

// Stops face reg.
async function stopFaceReg() {
	console.log("Face Reg Stopped!");
	clearInterval(faceRegInterval);
}

// ----------------------------------------- End Of Functions ---------------------------------------




// Register with StreamController that this is the broadcasting socket.
socket.emit("stream_broadcaster");
