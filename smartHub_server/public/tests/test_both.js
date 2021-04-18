
'use strict';

let peerConnection;

const socket = io.connect(window.location.origin);

window.onunload = window.onbeforeunload = () => {
	socket.close();
};

const localVideo = document.getElementById("localVideo");
const localAudio = document.getElementById("localAudio");
const remoteAudio = document.getElementById("remoteAudio");
const startButton = document.getElementById("startButton");

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



//----------------------------------------- Socket Events ---------------------------------------

socket.on("offer", (id, description) => {

	init(function () {

		peerConnection = new RTCPeerConnection(config);

		peerConnection
			.setRemoteDescription(description)
			.then(() => peerConnection.createAnswer())
			.then(sdp => peerConnection.setLocalDescription(sdp))
			.then(() => {
				socket.emit("answer", id, peerConnection.localDescription);
			});

		let stream = localAudio.srcObject;

		stream.getTracks().forEach( track =>
			peerConnection.addTrack(track, stream)
		);

		peerConnection.ontrack = event => {
			console.log(event.streams[0].getTracks());
			console.log("Receiving Video Stream!");
			localVideo.srcObject = new MediaStream(event.streams[0].getVideoTracks());
			console.log("Receiving Audio Stream!");
			remoteAudio.srcObject = new MediaStream(event.streams[0].getAudioTracks());
		};

		peerConnection.onicecandidate = event => {
			console.log("Triggered!");
			if (event.candidate) {
				socket.emit("candidate", id, event.candidate);
			}
		};

	});

});

// Exchange of ICE candidates.
socket.on("candidate", (id, candidate) => {
	if(peerConnection){
		peerConnection
	    .addIceCandidate(new RTCIceCandidate(candidate))
	    .catch(e => console.error(e));
	}
});

const constraints = {
  video: true,
  audio: true
}

startButton.onclick = function () {
	socket.emit("stream_viewer", constraints);
}

socket.on("connect", () => {
  socket.emit("stream_viewer", constraints);
});

//----------------------------------------- Socket Events ---------------------------------------

async function init(callback) {

	console.log("Stream Starting!");

  try{
    navigator.mediaDevices.getUserMedia({audio: true}).then( (stream) => {

			localAudio.srcObject = stream;

			callback();

    }).catch( (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }

}
