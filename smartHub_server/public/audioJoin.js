const socket = io.connect(window.location.origin + "/audio");
const localAudioElement = document.getElementById("localAudio");
const remoteAudioElement = document.getElementById("remoteAudio");

let localAudioStream = new MediaStream();
let remoteAudioStream;

let peerConnection;

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

socket.on("offer", (id, description) => {

  peerConnection = new RTCPeerConnection(config);

  localAudioStream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });

  // Fetch that remote audio when tracks available.
  peerConnection.ontrack = event => {
    remoteAudioElement.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});


socket.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

// On connection, announce you want to join in on audio chat.
socket.on("connect", () => {
  getLocalAudioStream();
});

socket.on("audio_origin", () => {
  socket.emit("audio_join");
});

//----------------------------------------- Socket Events ---------------------------------------

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
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

      socket.emit("audio_join");

    }).catch( function (err)  {
      console.log(err);
    });

}
