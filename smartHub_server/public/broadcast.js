
'use strict';

// Object for holding RTCPeerConnection objects. Stored as key:value pairs.
// Key is the socket id, value is the RTCPeerConnection object.
const peerConnections = {};
const socket = io.connect(window.location.origin + "/video");
const videoElement = document.getElementById("videoSource");
let mediaRecorder;
let faceRegInterval;
const canvas = document.getElementById("canvas");
const photos = document.getElementById("photoOutput");
const photoButton = document.getElementById("photo-button");

// ----------------------------------------------------- Start of Configuration Options. -----------------------------------------------------

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

// ------------------------------------------------------ End of Configuration Options. ------------------------------------------------------



// ----------------------------------------- Socket Events ---------------------------------------

socket.on("watcher", id => {
	const peerConnection = new RTCPeerConnection(config);
	peerConnections[id] = peerConnection;

	let stream = videoElement.srcObject;
	stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			socket.emit("candidate", id, event.candidate);
		}
	};

	peerConnection.createOffer()
		.then(sdp => peerConnection.setLocalDescription(sdp))
		.then(() => {
			socket.emit("offer", id, peerConnection.localDescription);
		});
});

socket.on("answer", (id, description) => {
	peerConnections[id].setRemoteDescription(description);
});

socket.on("candidate", (id, candidate) => {
	peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("start_recording", id => {
	startRecording();
});

socket.on("stop_recording", id => {
	stopRecording();
});

socket.on("take_image", () =>{
  takePicture();
});

socket.on("stop_face_reg", async () => {
  await stopFaceReg();
});

socket.on("start_face_reg", async () => {
  await startFaceReg();
})

socket.on("disconnectPeer", id => {
	peerConnections[id].close();
	delete peerConnections[id];
});

// ----------------------------------------- End Of Socket Events ---------------------------------------



// ----------------------------------------- Face Recognition ---------------------------------------

// Load models from face API.
async function loadModels () {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

// Starts face reg.
async function startFaceReg () {

  const videoCanvas = faceapi.createCanvasFromMedia(videoElement);
  const displaySize = { width: 320, height: 320 };
  faceapi.matchDimensions(videoCanvas, displaySize);

  if(!faceRegInterval) {

      faceRegInterval = setInterval( async () => {
          // Use in browser API to only send image back when a face is detected. Avoids sending too many images.
          const detections = await faceapi.detectAllFaces(videoElement, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const context = videoCanvas.getContext("2d");

          if(resizedDetections.length !== 0){
            context.drawImage(videoElement, 0, 0);
            console.log(resizedDetections);
            socket.emit("face_image", videoCanvas.toDataURL());
          }
      }, 100);
  }

}

// Stops face reg.
async function stopFaceReg () {
  console.log("Face Reg Stopped!");
  clearInterval(faceRegInterval);
}

// ----------------------------------------- End Of Face Recognition ---------------------------------------



// ----------------------------------------- Image Taking ---------------------------------------

photoButton.addEventListener('click', function(e){
  takePicture();
  e.preventDefault();
} , false);

//take picture from canvas
function takePicture() {
  //create canvas
  const context = canvas.getContext('2d');
  //set canvas props
  canvas.width = width;
  canvas.height = height;
  //draw image of the video on the canvas
  context.drawImage(videoElement, 0, 0,  width, height);
  //create image from canvas
  const imgURL = canvas.toDataURL('image/png');
  // console.log("imgURL is " , imgURL);
  //create img element
  const img = document.createElement('img');
  // console.log("img source is" , img);
  //set image source
  img.setAttribute('src', imgURL);
  //add img to photos
  photos.src = imgURL;
  //console.log(photos);
  handleImages(imgURL);
}

function handleImages(data){
  socket.emit("taken_image" , data);
}
// ----------------------------------------- End of Image Taking ---------------------------------------



// ----------------------------------------- Video Recording ---------------------------------------

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
		mediaRecorder = new MediaRecorder(window.stream, options);
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

// ----------------------------------------- End Of Video Recording ---------------------------------------



window.onunload = window.onbeforeunload = () => {
  socket.close();
};

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const constraints = {
    video: {
      width: 320,
      height: 320
    }
  };
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(startStream)
    .catch(handleError);
}

function startStream(stream) {
  // Make stream object available to the browser console.
  window.stream = stream;
  // Change src of video element to the stream object.
  videoElement.srcObject = stream;
  // Emit to all sockets that a broadcaster is ready.
  socket.emit("broadcaster");
}

// Error handler for starting stream.
function handleError(error) {
  console.error("Error: ", error);
}

getStream();
loadModels();
