import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast, {BaseToast} from 'react-native-toast-message'
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

import * as socketio from "socket.io-client";
const io = require("socket.io-client");

export default class Streaming extends Component<{route: any, navigation: any}, {responseText: String, deviceIP: String}>{

    constructor(props: any){
        super(props);

        this.state = ({
            responseText: "",
            deviceIP: "",
            remoteStream: {toURL: () => null},
            socket: null,
            peerConnection: new RTCPeerConnection({
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

        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);

        this.handleOffer = this.handleOffer.bind(this);
        this.handleCandidate = this.handleCandidate.bind(this);
        this.handleOrigin = this.handleOrigin.bind(this);
        this.setRemoteStream = this.setRemoteStream.bind(this);
    }

    getDeviceIP = async () => {
        let collection: any = {}
        collection.user_email = this.props.route.params.userEmail;
        collection.profile_name = this.props.route.params.profileName;
        collection.device_name = this.props.route.params.device_name;
        collection.device_type = this.props.route.params.device_type;

        await axios.post(getAddressString() + '/profiles/getProfileAddress', collection).then((response) => {
            //return response.data.profiles
            this.setState({deviceIP: response.data.profile.device_address})
            //console.log(this.state.deviceIP)
            console.log(response.status)
        }, (error) => {
            console.log(error);
        })
    }

    // ---------------------------------------- Socket Handling Functions ----------------------------------------
    async handleOffer (id: any, description: any) {

      console.log("Handling offer from audio origin.");

      try {

        this.state.peerConnection.onaddstream = event => this.setRemoteStream(event.stream);

        this.state.peerConnection.onicecandidate = event => {
          if (event.candidate) {
            this.state.socket.emit("candidate", id, event.candidate);
          }
        };

        await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(description));

        const answer: any = await this.state.peerConnection.createAnswer();

        await this.state.peerConnection.setLocalDescription(answer);

        this.state.socket.emit("answer", id, this.state.peerConnection.localDescription);

        // this.setState({peerConnection: this.state.peerConnection});

      } catch (err) {

        console.log("Offer went wrong, Error: " + err);

      }

    }

    // Add new ICE candidate, which is the agreed upon method to connect.
    async handleCandidate (id: any, candidate: any) {

      console.log("Handling candidate from audio origin.");

      try{

        await this.state.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));

      } catch (err) {

        console.log("IceCandidate addition went wrong, Error: " + err);
      }

    }

    async handleOrigin () {
      this.state.socket.emit("audio_join");
    }

    // ---------------------------------------- Socket Handling Functions ----------------------------------------

    // Sets the stream.
    setRemoteStream (stream: any) {
      console.log("Setting Stream!");
      this.setState({remoteStream: stream});
    }

    beginStream = () => {
        // New url for audio. Set to socket namespace called audio.
        var url = 'http://' + this.state.deviceIP + ':4000/audio';

        console.log(this.state.deviceIP);

        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }

        const socket = io.connect(url);

        socket.on("offer", (id: any, description: any) => this.handleOffer(id, description));
        socket.on("candidate", (id: any, description: any) => this.handleCandidate(id, description));
        socket.on("audio_origin", () => this.handleOrigin());

        this.setState({socket: socket});

        const constraints: any = { audio : true };

        try{

          let stream = await mediaDevices.getUserMedia(constraints);

          this.state.peerConnection.addStream(stream);

          this.state.socket.emit("audio_join");

        } catch (err) {
          console.log(err);
        }

        if(this.state.responseText!== 'Stream Starting.'){
            console.log(this.state.deviceIP)
            axios.post(url).then((response) => {
                console.log(response.status)
                Toast.show({
                    type: 'success',
                    text1: 'Processing Request Please Wait...',
                    visibilityTime: 5000
                })
                setTimeout(() => {
                        this.setState({responseText: response.data})
                        Toast.show({
                            type: 'success',
                            text1: 'The Stream Is Live!',
                            text2: 'Enjoy.',
                            visibilityTime: 2000
                        })
                    }
                ,
                5000);
            }, (error) => {
             console.log(error);
         })
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Stream Is Already Live!',
                text2: 'Click on the video player to view the stream.',
                visibilityTime: 2000
            })
        }
    }

    stopStream = () => {

      // Code to stop audio.

      if(this.state.socket !== null) {
        this.state.socket.disconnect();
      }

      this.setState({socket: null});

      this.state.peerConnection.close();

      this.setState({peerConnection:
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

      this.setState({remoteStream: {toURL: () => null}});

      // Code to stop audio.

        var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        if(this.state.responseText !== 'Stream Closing.'){
            axios.post(url).then((response) => {
                this.setState({responseText: response.data})
                Toast.show({
                    type: 'error',
                    text1: 'Stop Stream Clicked!',
                    text2: 'The stream is no longer live.',
                    visibilityTime: 2000
                });
                console.log(response.data)
            }, (error) => {
                console.log(error);
            })
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Stream has already stopped!',
                visibilityTime: 2000
            })
        }
    }

    stopStreamOnBackClick = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            return;
        }
        if(this.state.responseText !== 'Stream Closing.'){
            axios.post(url).then((response) => {
                this.setState({responseText: response.data})
                console.log(response.data)
            }, (error) => {
                console.log(error);
            })
        }
    }


    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
            headerLeft: () =>
            <View>
                <TouchableOpacity
                    onPress={()=>{this.stopStreamOnBackClick(); this.props.navigation.navigate('Live Streaming Devices')}}>
                <Text style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 10, fontSize:15, fontWeight: 'bold'}}>Back</Text>
                </TouchableOpacity>
            </View>
        })
        this.getDeviceIP();
    }

    render(){
       // console.log(this.props.route)
        const toastConfig = {
            success: ({ text1, text2, ...rest } : any) => (
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

            error: ({ text1, text2, ...rest } : any) => (
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
        return(
        <View style={{flex:1, backgroundColor: "#222222"}}>
            <Toast style={{zIndex: 1}} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
               <RTCView streamURL={this.state.remoteStream.toURL()} />
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50, paddingBottom: 80}}>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.beginStream}>
                <Text style={{fontSize: 20}}>Begin Stream</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.stopStream}>
                <Text style={{fontSize: 20}}>Stop Stream</Text>
            </TouchableOpacity>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create ({

    pillButton: {
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        margin: 5,
        width:175,
        height:50,
        borderRadius:20,
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },

})
