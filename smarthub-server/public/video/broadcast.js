
const socket = io.connect(window.location.origin);
const videoElement = document.getElementById("videoSource");
const peerConnections = {};

const constraints = {
  video: true
};

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
});

socket.on("watch", id => {
  const peerConnection = new RTCPeerConnection();
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

socket.on("candidate", (id, candidate) => {
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

function getStream() {

  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(startStream)
    .catch(handleError);
}

function startStream(stream) {
  videoElement.srcObject = stream;
  socket.emit("broadcast");
}

function handleError(error) {
  console.error("Error: ", error);
}

getStream();
