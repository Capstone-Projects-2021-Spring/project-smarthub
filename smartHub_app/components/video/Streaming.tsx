import axios from 'axios';
import Toast, { BaseToast } from 'react-native-toast-message'
import { WebView } from 'react-native-webview'
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
// import { //UNCOMMENT THIS
//     RTCPeerConnection,
//     RTCIceCandidate,
//     RTCSessionDescription,
//     RTCView,
//     mediaDevices,
// } from 'react-native-webrtc';
import FeatureModal from '../modals/modalForFeatureToggle';
import { Icon } from 'native-base';
import Record from './Recording';
import ImageCapture from './ImageCapture';
import {startFaceRec, stopFaceRec} from './FacialRecognition'
import { startMotionDetection, stopMotionDetection } from './MotionDetection';
import { getAddressString } from '../../utils/utilities';
import RoundedButton from '../buttons/RoundedButton';

const io = require("socket.io-client");
var width: number = Dimensions.get('window').width;
var height: number = Dimensions.get('window').height;

//peerAudioConnection: any, put this stuff in state variables
// peerVideoConnection: any,
export default class Stream extends Component<{type: number, deviceId: number, navigation: any},{profileId: number, phoneNumber: String, deviceIP: String, userEmail: String, profileName: String, featureType: String, checkStream: boolean, remoteVideoStream: any, videoSocket: any,  remoteAudioStream: any, audioSocket: any,  streamText: string, streamFunction: any, intercomText: string, intercomFunction: any, intercomImage: any}>{

    constructor(props: any) {
        super(props);
        this.state = ({
            checkStream: false,
            videoSocket: null,
            featureType: "",
            deviceIP: "",
            userEmail: "",
            profileName: "",
            phoneNumber: "",
            profileId: 0,
            remoteVideoStream: { toURL: () => null },
            remoteAudioStream: { toURL: () => null },
            audioSocket: null,
            // peerVideoConnection: new RTCPeerConnection({ //UNCOMMENT THIS
            //     iceServers: [
            //         {
            //             urls: 'stun:stun.l.google.com:19302',
            //         },
            //         {
            //             urls: 'stun:stun1.l.google.com:19302',
            //         },
            //         {
            //             urls: 'stun:stun2.l.google.com:19302',
            //         },
            //     ]
            // }),
            // peerAudioConnection: new RTCPeerConnection({
            //     iceServers: [
            //         {
            //             urls: 'stun:stun.l.google.com:19302',
            //         },
            //         {
            //             urls: 'stun:stun1.l.google.com:19302',
            //         },
            //         {
            //             urls: 'stun:stun2.l.google.com:19302',
            //         },
            //     ]
            // }), 
            
            streamFunction: this.beginStream,
            streamText: "Start Stream",

            intercomText: "Talk",
            intercomFunction: this.beginAudio,

            intercomImage: require('../../assets/mic-off.png') 
        })
    }

    checkStream = async() => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/stream_check';
        console.log(url)
        await axios.post(url).then((response) => {
            console.log(response.data)
            this.setState({checkStream: response.data.streaming})
            if(this.state.checkStream == true)
            {
                this.setState({streamFunction: this.stopStream, streamText:"Stop Stream"});
            }
            else
            {
                this.setState({streamFunction: this.beginStream, streamText:"Start Stream"});
            }
        }, (error) => {
            console.log(error);
            console.log("we are here error")
        })
    }

    getConfig = async() => {
        var collection = {
            device_id: this.props.deviceId
        }
        var url = 'http://' + this.state.deviceIP + ':4000/devices/getConfig';
        await axios.post(url, collection).then((response: any) => {
            this.setState({
                featureType: response.data.device.device_config.type
            })
            console.log(response.data);          
        }, (error) => {
            console.log("getting device config failed");
            console.log(error);
        })
    }

    getDeviceInfo = async () => {
        //console.log(this.props.route);
        let collection: any = {}
        collection.device_id = this.props.deviceId;
        await axios.post(getAddressString() + '/devices/getDeviceInfo', collection).then((response) => {
            this.setState({deviceIP: response.data.device[0].device_address,
                userEmail: response.data.device[0].user_email,
                profileName: response.data.device[0].profile_name,
                profileId: response.data.device[0].profile_id,
                phoneNumber: response.data.device[0].phone_number})
        }, (error) => {
            console.log(error);
        })

        await this.checkStream();
        var url = 'http://' + this.state.deviceIP + ':4000/video';
        const videoSocket = io.connect(url);
        videoSocket.on("offer", (id: any, description: any) => this.handleVideoOffer(id, description));
        videoSocket.on("candidate", (id: any, description: any) => this.handleVideoCandidate(id, description));
        videoSocket.on("broadcaster", () => this.handleVideoOrigin());
        this.setState({ videoSocket: videoSocket })
        if(this.state.checkStream) this.state.videoSocket.emit("watcher");
    }

    beginStream = async () => {
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"
            && this.state.deviceIP !== 'lukessmarthub.ddns.net' && this.state.deviceIP !== '192.168.86.244') {
            alert('Device not compatible for Streaming.')
            return;
        }
        await this.checkStream();
        if(!this.state.checkStream){
            var url = 'http://' + this.state.deviceIP + ':4000/video/start_stream';
            // if(this.state.deviceIP !== 'lukessmarthub.ddns.net' &&  this.state.deviceIP !== "petepicam1234.zapto.org" && this.state.deviceIP !== "leohescamera.ddns.net"){
            //     alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            //     return;
            // }
            await axios.post(url).then((response) => {
                this.setState({checkStream: true});
                console.log(this.state.checkStream)
                Toast.show({
                    type: 'success',
                    text1: 'Processing Request Please Wait...',
                    visibilityTime: 5000
                })
                setTimeout(() => {
                    Toast.show({
                        type: 'success',
                        text1: 'The Stream Is Live!',
                        text2: 'Enjoy!',
                        visibilityTime: 4000
                    })
                }
                ,
                5000);
                this.setState({streamFunction: this.stopStream, streamText:"Stop Stream"});
                this.beginAudio();
            }, (error) => {
                console.log(error);
            })
        }else if(this.state.checkStream){
            Toast.show({
                type: 'success',
                text1: 'The Stream Is Already Live!',
                visibilityTime: 2000
            })
         }

         if(!this.state.checkStream) this.state.videoSocket.emit("watcher");

    }

    stopStream = async() => {
        if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"
            && this.state.deviceIP !== 'lukessmarthub.ddns.net' && this.state.deviceIP !== '192.168.86.244') {
            alert('Device not compatible for Streaming.')
            return;
        }
        await this.checkStream();
        if(this.state.checkStream){
            var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
            // if(this.state.deviceIP !== 'lukessmarthub.ddns.net' && this.state.deviceIP !== "leohescamera.ddns.net"){
            //     alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            //     return;
            // }
            axios.post(url).then(async(response) => {
                this.setState({checkStream: false})
                Toast.show({
                    type: 'error',
                    text1: 'Stop Stream Clicked!',
                    text2: 'The stream is no longer live.',
                    visibilityTime: 2000
                });
                await this.stopAudio();
                await this.getConfig();
                if(this.state.featureType == "Motion")
                {
                    console.log("stopping motion")
                    stopMotionDetection(this.state.deviceIP);
                }
                else if(this.state.featureType == "Facial"){
                    console.log("stopping facial")
                    stopFaceRec(this.state.deviceIP);
                }

                this.setState({streamFunction: this.beginStream, streamText:"Start Stream"});
                
            }, (error) => {
                console.log(error);
            })
        }else{
            alert("The stream is no longer live.")
        }

        // if (this.state.videoSocket !== null) {
        //     this.state.videoSocket.disconnect();
        // }

        // this.setState({ videoSocket: null });

        // this.state.peerVideoConnection.close(); UNCOMMENT THIS
        console.log("Stop intercom success");

        //UNCOMMENT THIS

        // this.setState({
        //     peerVideoConnection:
        //         new RTCPeerConnection({
        //             iceServers: [
        //                 {
        //                     urls: 'stun:stun.l.google.com:19302',
        //                 },
        //                 {
        //                     urls: 'stun:stun1.l.google.com:19302',
        //                 },
        //                 {
        //                     urls: 'stun:stun2.l.google.com:19302',
        //                 },
        //             ]
        //         })
        // });

        this.setState({ remoteAudioStream: { toURL: () => null } });
        this.setVideoRemoteStream({ toURL: () => null });
    }

    //--------------------------------- Stream Handling ----------------------
    setVideoRemoteStream(stream: any) {
        console.log("Setting Video Stream!");
        this.setState({ remoteVideoStream: stream });
    }
    
    async handleVideoOffer (id: any, description: any) {

        // console.log("Handling offer from audio origin."); UNCOMMENT THIS

        // try {

        //     this.state.peerVideoConnection.onaddstream = (event: any) => this.setVideoRemoteStream(event.stream);

        //     this.state.peerVideoConnection.onicecandidate = (event: any) => {
        //         if (event.candidate) {
        //             this.state.videoSocket.emit("candidate", id, event.candidate);
        //         }
        //     };

        //     // await this.state.peerVideoConnection.setRemoteDescription(new RTCSessionDescription(description)); //UNCOMMENT THIS

        //     const answer: any = await this.state.peerVideoConnection.createAnswer();

        //     await this.state.peerVideoConnection.setLocalDescription(answer);

        //     this.state.videoSocket.emit("answer", id, this.state.peerVideoConnection.localDescription);

        //     //this.setState({peerConnection: this.state.peerConnection});

        // } catch (err) {

        //     console.log("Offer went wrong, Error: " + err);

        // }

    }
    
    // Add new ICE candidate, which is the agreed upon method to connect.
    async handleVideoCandidate (id: any, candidate: any) {

        console.log("Handling candidate from audio origin.");

        try{

            // await this.state.peerVideoConnection.addIceCandidate(new RTCIceCandidate(candidate)); //UNCOMMENT THIS

        } catch (err) {

            console.log("IceCandidate addition went wrong, Error: " + err);
        }

    }

    async handleVideoOrigin () {
        this.state.videoSocket.emit("watcher");
    }
    //----------------------------------- End of Stream Handling --------------------------

    // -------------------------------- Audio Socket Handling Functions ---------------------
    async handleAudioOffer(id: any, description: any) {

        // console.log("Handling offer from audio origin."); UNCOMMENT THIS

        // try {

        //     this.state.peerAudioConnection.onaddstream = (event: any) => this.setAudioRemoteStream(event.stream);

        //     this.state.peerAudioConnection.onicecandidate = (event: any) => {
        //         if (event.candidate) {
        //             this.state.audioSocket.emit("candidate", id, event.candidate);
        //         }
        //     };

        //     // await this.state.peerAudioConnection.setRemoteDescription(new RTCSessionDescription(description)); //UNCOMMENT THIS

        //     const answer: any = await this.state.peerAudioConnection.createAnswer();

        //     await this.state.peerAudioConnection.setLocalDescription(answer);

        //     this.state.audioSocket.emit("answer", id, this.state.peerAudioConnection.localDescription);

        // } catch (err) {

        //     console.log("Offer went wrong, Error: " + err);

        // }

    }

    // Add new ICE candidate, which is the agreed upon method to connect.
    async handleAudioCandidate(id: any, candidate: any) {

        console.log("Handling candidate from audio origin.");

        try {

            // await this.state.peerAudioConnection.addIceCandidate(new RTCIceCandidate(candidate)); //UNCOMMENT THIS

        } catch (err) {

            console.log("IceCandidate addition went wrong, Error: " + err);
        }

    }

    async handleAudioOrigin() {
        this.state.audioSocket.emit("audio_join");
    }

    // Sets the stream.
    setAudioRemoteStream(stream: any) {
        console.log("Setting Audio Stream!");
        this.setState({ remoteAudioStream: stream });
    }
    //---------------------- End of Audio Socket Handling Functions ---------------------

    beginAudio = async () => {
        // New url for audio. Set to audioSocket namespace called audio.
        var url = 'http://' + this.state.deviceIP + ':4000/audio/start_intercom';

        await axios.post(url).then((response) => {
            console.log(response.data)
            this.setState({intercomFunction: this.stopAudio, intercomText:"Stop Talking", intercomImage: require('../../assets/mic-on.png')});
        }, (error) => {
            console.log(error);
        })

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

        // try { UNCOMMENT THIS

        //     let stream = await mediaDevices.getUserMedia(constraints);

        //     this.state.peerAudioConnection.addStream(stream);

        //     console.log("Start intercom success");
        //     if(this.props.type === 2) alert("The Intercom has started.");

        //     this.state.audioSocket.emit("audio_join");

        // } catch (err) {
        //     console.log("Start intercom error");
        //     console.log(err);
        // }
    }

    stopAudio = async() => {
        
        var url = 'http://' + this.state.deviceIP + ':4000/audio/stop_intercom';
        
        await axios.post(url).then((response) => {
            console.log(response.data);
            this.setState({intercomFunction: this.beginAudio, intercomText:"Talk", intercomImage: require('../../assets/mic-off.png')});
        }, (error) => {
            console.log(error);
        })

        // Code to stop audio.

        if (this.state.audioSocket !== null) {
            this.state.audioSocket.disconnect();
        }

        this.setState({ audioSocket: null });

        // this.state.peerAudioConnection.close(); UNCOMMENT THIS
        console.log("Stop intercom success");
        // if(this.props.type === 2) alert("The Intercom has stopped.");

        // this.setState({ //UNCOMMENT THIS
        //     peerAudioConnection:
        //         new RTCPeerConnection({
        //             iceServers: [
        //                 {
        //                     urls: 'stun:stun.l.google.com:19302',
        //                 },
        //                 {
        //                     urls: 'stun:stun1.l.google.com:19302',
        //                 },
        //                 {
        //                     urls: 'stun:stun2.l.google.com:19302',
        //                 },
        //             ]
        //         })
        // });

        this.setState({ remoteAudioStream: { toURL: () => null } });

        // Code to stop audio.
    }

    //------------------------------------Config modal----------------------------------------------
    launchModal = () => {
        this.refs.featureModal.showModal();
    }

     deviceConfigurationCallback = async (deviceConfig: any) => {
        console.log(deviceConfig);
        var url = 'http://' + this.state.deviceIP + ':4000/devices/updateConfig';
        var collection = {
            device_config: deviceConfig,
            device_id: this.props.deviceId
        }
        axios.post(url, collection).then((response) => {
            console.log(response.data)
        }, (error) => {
            console.log(error);
        })
        
        var feature = deviceConfig.type === "None" ? "None" : deviceConfig.type === "Facial" ? "Facial" : "Motion";
    
        if(feature === "Facial"){
            if(!this.state.checkStream){
                await this.beginStream();
            }
            var params = {
                user_email: this.state.userEmail,
                profile_name: this.state.profileName,
                profile_id: this.state.profileId,
                device_id: this.props.deviceId,
                phone_number: this.state.phoneNumber,
                device_ip: this.state.deviceIP
            }
            setTimeout(()=>startFaceRec(params), 15000);

        }else if(feature === "Motion"){
            if(!this.state.checkStream){
                await this.beginStream();
            }
            var params = {
                user_email: this.state.userEmail,
                profile_name: this.state.profileName,
                profile_id: this.state.profileId,
                device_id: this.props.deviceId,
                phone_number: this.state.phoneNumber,
                device_ip: this.state.deviceIP
            }
            setTimeout(()=>startMotionDetection(params), 15000);
        }

    }
    //------------------------------------End of Config modal----------------------------------------------

    componentDidMount = async() => {
        if(this.props.type === 1){
            this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={this.launchModal}>
                <Icon name="ios-add" />
                </TouchableOpacity>  
            )
            })
        }
        await this.getDeviceInfo();
    }

    render(){
        const toastConfig = {
            success: ({ text1, text2, ...rest } : any) => (
              <BaseToast
                {...rest}
                style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                  fontSize: width/22,
                  fontWeight: 'bold'
                }}
                text2Style={{
                    color: "#000",
                    fontSize: width/25
                }}
                text1={text1}
                text2={text2}
              />
            ),

            error: ({ text1, text2, ...rest } : any) => (
                <BaseToast
                  {...rest}
                  style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  text1Style={{
                    fontSize:width/21,
                    fontWeight: 'bold'
                  }}
                  text2Style={{
                      color: "#000",
                      fontSize: width/26
                  }}
                  text1={text1}
                  text2={text2}
                />
              )
        }
        return(
            <View style={{flex: 1}}>
                <Toast style={{zIndex: 1}} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                <FeatureModal ref="featureModal" deviceIP={this.state.deviceIP} deviceId={this.props.deviceId} feature={this}/>                
                {this.props.type === 1 || this.props.type === 3 ?
                <View style={styles.videoContainer}>
                     <View style={[styles.videos, styles.remoteVideos]}>
                        <Image style={{flex: 1, resizeMode: 'contain', marginLeft: 140}} source={require("../../assets/video-cam-icon.png")} />
                        {/* <RTCView //UNCOMMENT THIS
                            streamURL={this.state.remoteVideoStream.toURL()}
                            style={styles.remoteVideo}
                            objectFit={'cover'}
                        /> */}
                    </View>
                    {/* <WebView //UNCOMMENT THIS
                        style={{flex: 1,}}
                        originWhitelist={['*']}
                        source={{html: '<iframe style="box-sizing: border-box; width: 100%; height: 100%; border: 15px solid #FF9900; background-color: #222222"; src="http://' + this.state.deviceIP + ':4000/watch.html" frameborder="0" allow="autoplay encrypted-media" allowfullscreen></iframe>'}} 
                        mediaPlaybackRequiresUserAction={false}
                    /> */}
                    {/* <RTCView streamURL={this.state.remoteAudioStream.toURL()} />     */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30}}>
                        <RoundedButton
                            onPress={this.state.streamFunction}
                            buttonText={this.state.streamText}>
                        </RoundedButton>                        
                    </View>
                {this.props.type === 1 ?
                    <View>
                        <Record userEmail={this.state.userEmail} profileName={this.state.profileName} deviceIP={this.state.deviceIP} />
                        <ImageCapture type="Regular Capture" profileId={this.state.profileId} userEmail={this.state.userEmail} profileName={this.state.profileName} deviceIP={this.state.deviceIP} />
                    </View>
                : this.props.type === 3 &&
                    <View>
                        <ImageCapture type="Face Capture" profileId={this.state.profileId} userEmail={this.state.userEmail} profileName={this.state.profileName} deviceIP={this.state.deviceIP} />
                    </View>
                }
                </View>
                :
                <View style={{justifyContent: 'center', alignItems: 'center', padding: 50}}>
                    <View style={{width: '45%', height: '40%', marginBottom: 100}}>
                        <Image style={{flex: 1, resizeMode: 'contain',  alignContent: 'center'}} source={this.state.intercomImage}/>
                    </View>
                    <RoundedButton
                            onPress={this.state.intercomFunction}
                            buttonText={this.state.intercomText}>
                    </RoundedButton> 
                </View>
            }
            </View>           
        );
    }
}

const styles = StyleSheet.create({

pillButton: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center',
    margin: 5,
    width:width-75,
    height:50,        
    borderRadius:20,
    backgroundColor: '#FF9900',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5, 
},

videoContainer: {
    flex: 1,
    minHeight: 450,
    width: width,
    paddingTop: 25
    
},
videos: {
    width: width,
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: "#1C1D2B"
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
    width: width
},
remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
},

})