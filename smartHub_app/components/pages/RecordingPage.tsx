import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview'
import axios from 'axios'
import Toast, { BaseToast } from 'react-native-toast-message'
import { getAddressString } from '../../utils/utilities';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals,
} from 'react-native-webrtc';

var width: number = Dimensions.get('window').width;

import * as socketio from "socket.io-client";
const io = require("socket.io-client");

export default class Recording extends Component<{ route: any, navigation: any }, { responseText: String, deviceIP: String, recordingResponseText: any, userEmail: String, profileName: String, remoteAudioStream: any, remoteVideoStream: any, audioSocket: any, videoSocket: any, peerAudioConnection: any, peerVideoConnection: any }>{

    constructor(props: any) {
        super(props);
        this.state = ({
            responseText: "",
            recordingResponseText: "",
            deviceIP: "",
            userEmail: "",
            profileName: "",
            remoteAudioStream: { toURL: () => null },
            remoteVideoStream: { toURL: () => null },
            audioSocket: null,
            videoSocket: null,
            peerAudioConnection: new RTCPeerConnection({
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
            }),
            peerVideoConnection: new RTCPeerConnection({
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
            })
        })

        // Video
        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);
        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);

        // Intercom
        this.beginAudio = this.beginAudio.bind(this);
        this.stopAudio = this.stopAudio.bind(this);

        // Intercom
        this.handleAudioOffer = this.handleAudioOffer.bind(this);
        this.handleAudioCandidate = this.handleAudioCandidate.bind(this);
        this.handleAudioOrigin = this.handleAudioOrigin.bind(this);

        // Video
        this.handleVideoOffer = this.handleVideoOffer.bind(this);
        this.handleVideoCandidate = this.handleVideoCandidate.bind(this);
        this.handleVideoOrigin = this.handleVideoOrigin.bind(this);

        //Needed for react to update state.
        this.setAudioRemoteStream = this.setAudioRemoteStream.bind(this);
        this.setVideoRemoteStream = this.setVideoRemoteStream.bind(this);
    }

    getDeviceIP = async () => {
        //console.log(this.props.route);
        let collection: any = {}
        collection.device_id = this.props.route.params.device_id;
        await axios.post(getAddressString() + '/devices/getDeviceInfo', collection).then((response) => {
            this.setState({ deviceIP: response.data.device[0].device_address })
            this.setState({ userEmail: response.data.device[0].user_email })
            this.setState({ profileName: response.data.device[0].profile_name })
        }, (error) => {
            console.log(error);
        })
    }

    // ---------------------------------------- Audio Socket Handling Functions ----------------------------------------
    async handleAudioOffer(id: any, description: any) {

        console.log("Handling offer from audio origin.");

        try {

            this.state.peerAudioConnection.onaddstream = (event: any) => this.setAudioRemoteStream(event.stream);

            this.state.peerAudioConnection.onicecandidate = (event: any) => {
                if (event.candidate) {
                    this.state.audioSocket.emit("candidate", id, event.candidate);
                }
            };

            await this.state.peerAudioConnection.setRemoteDescription(new RTCSessionDescription(description));

            const answer: any = await this.state.peerAudioConnection.createAnswer();

            await this.state.peerAudioConnection.setLocalDescription(answer);

            this.state.audioSocket.emit("answer", id, this.state.peerAudioConnection.localDescription);

        } catch (err) {

            console.log("Offer went wrong, Error: " + err);

        }

    }

    // Add new ICE candidate, which is the agreed upon method to connect.
    async handleAudioCandidate(id: any, candidate: any) {

        console.log("Handling candidate from audio origin.");

        try {

            await this.state.peerAudioConnection.addIceCandidate(new RTCIceCandidate(candidate));

        } catch (err) {

            console.log("IceCandidate addition went wrong, Error: " + err);
        }

    }

    async handleAudioOrigin() {
        this.state.audioSocket.emit("audio_join");
    }

    // ---------------------------------------- Video Socket Handling Functions ----------------------------------------
    async handleVideoOffer (id: any, description: any) {

        console.log("Handling offer from audio origin.");

        try {

            this.state.peerVideoConnection.onaddstream = (event: any) => this.setVideoRemoteStream(event.stream);

            this.state.peerVideoConnection.onicecandidate = (event: any) => {
                if (event.candidate) {
                    this.state.videoSocket.emit("candidate", id, event.candidate);
                }
            };

            await this.state.peerVideoConnection.setRemoteDescription(new RTCSessionDescription(description));

            const answer: any = await this.state.peerVideoConnection.createAnswer();

            await this.state.peerVideoConnection.setLocalDescription(answer);

            this.state.videoSocket.emit("answer", id, this.state.peerVideoConnection.localDescription);

            // this.setState({peerConnection: this.state.peerConnection});

        } catch (err) {

            console.log("Offer went wrong, Error: " + err);

        }

    }

    // Add new ICE candidate, which is the agreed upon method to connect.
    async handleVideoCandidate (id: any, candidate: any) {

        console.log("Handling candidate from audio origin.");

        try{

            await this.state.peerVideoConnection.addIceCandidate(new RTCIceCandidate(candidate));

        } catch (err) {

            console.log("IceCandidate addition went wrong, Error: " + err);
        }

    }

    async handleVideoOrigin () {
        this.state.videoSocket.emit("watcher");
    }


    // ---------------------------------------- Socket Handling Functions ----------------------------------------

    // Sets the stream.
    setAudioRemoteStream(stream: any) {
        console.log("Setting Audio Stream!");
        this.setState({ remoteAudioStream: stream });
    }

    setVideoRemoteStream(stream: any) {
        console.log("Setting Video Stream!");
        this.setState({ remoteVideoStream: stream });
    }

    beginAudio = async () => {
        // New url for audio. Set to audioSocket namespace called audio.
        var url = 'http://' + this.state.deviceIP + ':4000/audio/start_intercom';

        await axios.post(url).then((response) => {
            this.setState({ responseText: response.data })
            // Toast.show({
            //     type: 'error',
            //     text1: 'Start Audio Clicked!',
            //     text2: 'The Audio is live.',
            //     visibilityTime: 2000
            // });
            //console.log(response.data);
        }, (error) => {
            console.log(error);
        })

        //console.log(this.state.deviceIP);

        // if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
        //     alert(this.props.route.params.device_name + ' not compatible for live streaming.')
        //     return;
        // }

        url = 'http://' + this.state.deviceIP + ':4000/audio'

        const audioSocket = io.connect(url);

        audioSocket.on("offer", (id: any, description: any) => this.handleAudioOffer(id, description));
        audioSocket.on("candidate", (id: any, description: any) => this.handleAudioCandidate(id, description));
        audioSocket.on("audio_origin", () => this.handleAudioOrigin());

        this.setState({ audioSocket: audioSocket });

        const constraints: any = { audio: true };

        try {

            let stream = await mediaDevices.getUserMedia(constraints);

            this.state.peerAudioConnection.addStream(stream);

            console.log("Start intercom success");

            this.state.audioSocket.emit("audio_join");

        } catch (err) {
            console.log("Start intercom error");
            console.log(err);
        }
    }

    stopAudio = () => {

        var url = 'http://' + this.state.deviceIP + ':4000/audio/stop_intercom';

        axios.post(url).then((response) => {
            this.setState({ responseText: response.data })
            // Toast.show({
            //     type: 'error',
            //     text1: 'Stop Audio Clicked!',
            //     text2: 'The Audio is no longer live.',
            //     visibilityTime: 2000
            // });
            console.log(response.data);
        }, (error) => {
            console.log(error);
        })

        // Code to stop audio.

        if (this.state.audioSocket !== null) {
            this.state.audioSocket.disconnect();
        }

        this.setState({ audioSocket: null });

        this.state.peerAudioConnection.close();
        console.log("Stop intercom success");

        this.setState({
            peerAudioConnection:
                new RTCPeerConnection({
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
                })
        });

        this.setState({ remoteAudioStream: { toURL: () => null } });

        // Code to stop audio.
    }

    beginStream = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/start_stream';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        if (this.state.responseText !== 'Stream Starting.') {
            //console.log(this.state.deviceIP)
            axios.post(url).then((response) => {
                console.log(response.status)
                Toast.show({
                    type: 'success',
                    text1: 'Processing Request Please Wait...',
                    visibilityTime: 5000
                })
                setTimeout(() => {
                    this.setState({ responseText: response.data })
                    Toast.show({
                        type: 'success',
                        text1: 'The Stream Is Live!',
                        text2: 'Enjoy!',
                        visibilityTime: 2000
                    })
                }
                    ,
                    5000);
                this.beginAudio();
            }, (error) => {
                console.log(error);
            })
        } else {
            Toast.show({
                type: 'success',
                text1: 'The Stream Is Already Live!',
                text2: 'Click on the video player to view the stream.',
                visibilityTime: 2000
            })
        }


        // New url for audio. Set to socket namespace called audio.
        var url = 'http://' + this.state.deviceIP + ':4000/video';

        console.log(this.state.deviceIP);


        const videoSocket = io.connect(url);

        videoSocket.on("offer", (id: any, description: any) => this.handleVideoOffer(id, description));
        videoSocket.on("candidate", (id: any, description: any) => this.handleVideoCandidate(id, description));
        videoSocket.on("broadcaster", () => this.handleVideoOrigin());

        this.setState({ videoSocket: videoSocket }, () => {
            console.log("Yeeyee");
            this.state.videoSocket.emit("watcher");
        });


    }

    stopStream = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        if (this.state.responseText !== 'Stream Closing.') {
            axios.post(url).then((response) => {
                this.setState({ responseText: response.data })
                Toast.show({
                    type: 'error',
                    text1: 'Stop Stream Clicked!',
                    text2: 'The stream is no longer live.',
                    visibilityTime: 2000
                });
                this.stopAudio();
                console.log(response.data);
            }, (error) => {
                console.log(error);
            })
        } else {
            Toast.show({
                type: 'success',
                text1: 'The Stream has already stopped!',
                visibilityTime: 2000
            })
        }

        if (this.state.videoSocket !== null) {
            this.state.videoSocket.disconnect();
        }

        this.setState({ videoSocket: null });

        this.state.peerVideoConnection.close();
        console.log("Stop intercom success");

        this.setState({
            peerVideoConnection:
                new RTCPeerConnection({
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
                })
        });

        this.setState({ remoteAudioStream: { toURL: () => null } });

    }

    stopStreamOnBackClick = () => {
        this.stopAudio();
        var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            return;
        }
        if (this.state.responseText !== 'Stream Closing.') {
            axios.post(url).then((response) => {
                this.setState({ responseText: response.data })
                console.log(response.data)
            }, (error) => {
                console.log(error);
            })
        }
    }

    startRecord = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/start_recording';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            alert(this.props.route.params.device_name + ' not compatible for recording.')
            return;
        }

        if (this.state.recordingResponseText !== 'Recording Starting.') {
            axios.post(url).then((response) => {
                // alert("Recording");
                this.setState({ recordingResponseText: response.data })
                Toast.show({
                    type: 'error',
                    text1: 'Start Record Clicked!',
                    text2: 'The Recording is live.',
                    visibilityTime: 2000
                });
            }, (error) => {
                alert("Error Starting Recording");
                console.log(error);
            })
        } else {
            Toast.show({
                type: 'success',
                text1: 'The Recording has already started!',
                visibilityTime: 2000
            })
        }
    }

    stopRecord = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/stop_recording';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            alert(this.props.route.params.device_name + ' not compatible for recording.')
            return;
        }
        //console.log(url);
        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.state.profileName;
        collection.component_name = "Videos";

        if (this.state.recordingResponseText !== 'Recording Stopping.') {
            axios.post(url, collection).then((response) => {
                // alert("Stopping Recording");
                this.setState({ recordingResponseText: response.data })
                Toast.show({
                    type: 'error',
                    text1: 'Stop Record Clicked!',
                    text2: 'The Recording is no longer live.',
                    visibilityTime: 2000
                });
            }, (error) => {
                alert("Error Stopping Recording");
                console.log(error);
            })
        } else {
            Toast.show({
                type: 'success',
                text1: 'The Recording has already stopped!',
                visibilityTime: 2000
            })
        }
    }

    takePhoto = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/take_image';
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
            alert(this.props.route.params.device_name + ' not compatible for photo taking.')
            return;
        }

        if (this.state.responseText != 'Stream Starting.') {
            alert("Please Begin the Stream First!");
            return;
        }

        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.state.profileName;
        collection.component_name = "Images";

        axios.post(url, collection).then((response) => {
            // alert("Stopping Recording");
            this.setState({ responseText: response.data })
            Toast.show({
                type: 'error',
                text1: 'Take Photo Clicked!',
                text2: 'The image has been saved',
                visibilityTime: 2000
            });
        }, (error) => {
            alert("Error Taking Picture");
            console.log(error);
        })
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
            headerLeft: () =>
                <View>
                    <TouchableOpacity
                        onPress={() => { this.stopStreamOnBackClick(); this.props.navigation.navigate('Live Recording Devices') }}>
                        <Text style={{ paddingLeft: 20, paddingBottom: 10, fontSize: 15, fontWeight: 'bold' }}>Back</Text>
                    </TouchableOpacity>
                </View>
        })
        this.getDeviceIP();
    }

    render() {
        // console.log(this.props.route)
        const toastConfig = {
            success: ({ text1, text2, ...rest }: any) => (
                <BaseToast
                    {...rest}
                    style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    text1Style={{
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}
                    text2Style={{
                        color: "#000",
                        fontSize: 12
                    }}
                    text1={text1}
                    text2={text2}
                />
            ),

            error: ({ text1, text2, ...rest }: any) => (
                <BaseToast
                    {...rest}
                    style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    text1Style={{
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}
                    text2Style={{
                        color: "#000",
                        fontSize: 10
                    }}
                    text1={text1}
                    text2={text2}
                />
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: "#222222" }}>
                <Toast style={{ zIndex: 1 }} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                {/* VIDEO VIEW */}
                {/* <WebView
                    style={{
                        flex: 1,
                    }}
                    originWhitelist={['*']}
                    source={{html: '<iframe style="box-sizing: border-box; width: 100%; height: 100%; border: 15px solid #FF9900; background-color: #222222"; src="http://' + this.state.deviceIP + ':4000/watch.html" frameborder="0" allow="autoplay encrypted-media" allowfullscreen></iframe>'}} 
                    mediaPlaybackRequiresUserAction={false}
                /> */}
                <View style={styles.videoContainer}>
                    <View style={[styles.videos, styles.remoteVideos]}>
                        <Text>Friends Video</Text>
                        <RTCView
                            streamURL={this.state.remoteVideoStream.toURL()}
                            style={styles.remoteVideo}
                        />
                    </View>
                </View>

                {/* INTERCOM VIEW */}
                <RTCView streamURL={this.state.remoteAudioStream.toURL()} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50, paddingBottom: 30 }}>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress={
                            // console.log("streaming and intercom starting");
                            this.beginStream
                            // this.beginAudio
                        }>
                        <Text style={{ fontSize: 20 }}>Begin Stream</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress={
                            // console.log("streaming and intercom stoping");
                            this.stopStream
                            // this.stopAudio
                        }>
                        <Text style={{ fontSize: 20 }}>Stop Stream</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.photoButton}
                        onPress={this.takePhoto}>
                        <Text style={{ fontSize: 20 }}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30, paddingBottom: 80 }}>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress={this.startRecord}>
                        <Text style={{ fontSize: 20 }}>Begin Recording</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress={this.stopRecord}>
                        <Text style={{ fontSize: 20 }}>Stop Recording</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    pillButton: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        width: 175,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },

    photoButton: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        width: width - 75,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },

    videoContainer: {
        flex: 1,
        minHeight: 450,
    },
    videos: {
        width: '100%',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',

        borderRadius: 6,
    },
    localVideos: {
        height: 100,
        marginBottom: 10,
    },
    remoteVideos: {
        height: 400,
    },
    localVideo: {
        backgroundColor: '#f2f2f2',
        height: '100%',
        width: '100%',
    },
    remoteVideo: {
        backgroundColor: '#f2f2f2',
        height: '100%',
        width: '100%',
    },

})