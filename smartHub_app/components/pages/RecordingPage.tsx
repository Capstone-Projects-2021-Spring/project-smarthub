import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast, {BaseToast} from 'react-native-toast-message'
import { getAddressString } from '../../utils/utilities';

export default class Recording extends Component<{route: any, navigation: any}, {responseText: String, deviceIP: String, recordingResponseText: any}>{

    constructor(props: any){
        super(props);
        this.state= ({
            responseText: "",
            recordingResponseText: "",
            deviceIP: ""
        })
        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);    
        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);        
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
            console.log(this.state.deviceIP)
            console.log(response.status)
        }, (error) => {
            console.log(error);
        })
    }

    beginStream = () => {
        console.log(this.state.deviceIP);
        var url = 'http://' + this.state.deviceIP + ':4000/video/start_stream';
        //console.log(url);
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
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
                            text2: 'Enjoy!.',
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


    startRecord = () => {

        var url = 'http://' + this.state.deviceIP + ':4000/start_recording';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        
        if(this.state.recordingResponseText !== 'Recording Starting.'){
            axios.post(url).then((response) => {
                // alert("Recording");
                this.setState({recordingResponseText: response.data})
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
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Recording has already started!',
                visibilityTime: 2000
            })
        }
    }

    stopRecord = () => {

        var url = 'http://' + this.state.deviceIP + ':4000/stop_recording';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        console.log(url);
        let collection: any = {}
        collection.user_email = this.props.route.params.userEmail;
        collection.profile_name = this.props.route.params.profileName;

        if(this.state.recordingResponseText !== 'Recording Stopping.'){
            axios.post(url, collection).then((response) => {
                // alert("Stopping Recording");
                this.setState({recordingResponseText: response.data})
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
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Recording has already stopped!',
                visibilityTime: 2000
            })
        }
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
            headerLeft: () => 
            <View>
                <TouchableOpacity
                    onPress={()=>{this.stopStreamOnBackClick(); this.props.navigation.navigate('Live Recording Devices')}}>
                <Text style={{paddingLeft: 20, paddingBottom: 10, fontSize:15, fontWeight: 'bold'}}>Back</Text>
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
               <WebView
                style={{
                    flex: 1,
                }}
                originWhitelist={['*']}
                source={{html: '<iframe style="box-sizing: border-box; width: 100%; height: 100%; border: 15px solid #FF9900; background-color: #222222"; src="http://' + this.state.deviceIP + ':4000/watch.html" frameborder="0" allow="autoplay encrypted-media" allowfullscreen></iframe>'}} 
                mediaPlaybackRequiresUserAction={false}
                />
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

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50, paddingBottom: 80}}>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.startRecord}>
                <Text style={{fontSize: 20}}>Begin Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.stopRecord}>
                <Text style={{fontSize: 20}}>Stop Recording</Text>
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