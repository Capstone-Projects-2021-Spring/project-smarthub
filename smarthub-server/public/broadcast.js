
'use strict';

// Object for holding RTCPeerConnection objects. Stored as key:value pairs.
// Key is the socket id, value is the RTCPeerConnection object.
const peerConnections = {};
const socket = io.connect(window.location.origin);
const videoElement = document.getElementById("videoSource");

let mediaRecorder;

//creating canvas width and height
let width = 320;
let height = 0;


// Configuration for RTC peer connections. STUN and TURN servers.
// STUN for identifying public ip address.
// TURN for NAT traversal (getting pass firewalls).
// Currently uses a public STUN server.
const config = {
  iceServers: [
    {
      "urls": "stun:stun.l.google.com:19302",
    },
  ]
};

//----------------------------------------- Socket Events ---------------------------------------

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

  peerConnection
    .createOffer()
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

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
});

//----------------------------------------- Socket Events ---------------------------------------

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
    video: true,
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

function startRecording() {

  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/webm;codecs=vp8,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
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

getStream();
