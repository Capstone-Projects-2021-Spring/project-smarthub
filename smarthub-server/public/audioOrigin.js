
'use strict';

const peerConnections = {};
const socket = io.connect(window.location.origin + "/audio");
const localAudioElement = document.getElementById("localAudio");
const remoteAudioElement = document.getElementById("remoteAudio");
let localAudioStream;
let remoteAudioStream;

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

//----------------------------------------- Socket Events ---------------------------------------

socket.on("audio_join", id => {

  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  localAudioStream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.ontrack = event => {
    remoteAudioElement.srcObject = event.streams[0];
  };

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

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
});

//----------------------------------------- Socket Events ---------------------------------------

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

function getLocalAudioStream() {

  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  const constraints = { audio : true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then( function (stream) {

      window.stream = stream;

      localAudioElement.srcObject = stream;

      localAudioStream = localAudioElement.srcObject;

      socket.emit("audio_origin");

    }).catch( function (err)  {
      console.log(err);
    });

}

getLocalAudioStream();
