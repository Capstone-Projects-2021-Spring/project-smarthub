import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast, {BaseToast} from 'react-native-toast-message'
import { getAddressString } from '../../utils/utilities';

var width : number = Dimensions.get('window').width;

export default class TakePhoto extends Component<{route: any, navigation: any}, {responseText: String, deviceIP: String, recordingResponseText: any, userEmail: String, profileName: String}>{

    constructor(props: any){
        super(props);
        this.state= ({
            responseText: "",
            recordingResponseText: "",
            deviceIP: "",
            userEmail: "",
            profileName: "",
        })

        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);    
    }

    getDeviceIP = async () => {
        //console.log(this.props.route);
        let collection: any = {}
        collection.device_id = this.props.route.params.device_id;
        await axios.post(getAddressString() + '/devices/getDeviceInfo', collection).then((response) => {
            this.setState({deviceIP: response.data.device[0].device_address})
            this.setState({userEmail: response.data.device[0].user_email})
            this.setState({profileName: response.data.device[0].profile_name})
        }, (error) => {
            console.log(error);
        })
    }


    beginStream = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/start_stream';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for live streaming.')
            return;
        }
        if(this.state.responseText!== 'Stream Starting.'){
            //console.log(this.state.deviceIP)
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
                            text2: 'Enjoy!',
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
                console.log(response.data);
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

    takePhoto = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/take_image';
        if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for photo taking.')
            return;
        }

        if(this.state.responseText != 'Stream Starting.'){
            alert("Please Begin the Stream First!");
            return;
        }

        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.state.profileName;
        collection.component_name = "Images";

        axios.post(url, collection).then((response) => {
            // alert("Stopping Recording");
            this.setState({responseText: response.data})
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
            headerLeft: () => 
            <View>
                <TouchableOpacity
                    onPress={()=>{this.stopStreamOnBackClick(); this.props.navigation.navigate('Image Capture Devices')}}>
                <Text style={{paddingLeft: 20, paddingTop: 8, paddingBottom: 10, fontSize:15, fontWeight: 'bold'}}>Back</Text>
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
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50, paddingBottom: 30}}>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress= {
                            this.beginStream
                        }>
                        <Text style={{fontSize: 20}}>Begin Stream</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pillButton}
                        onPress={
                            this.stopStream
                        }>
                        <Text style={{fontSize: 20}}>Stop Stream</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                        style={styles.photoButton}
                        onPress={this.takePhoto}>
                        <Text style={{fontSize: 20}}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30, paddingBottom: 80}}>
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

})