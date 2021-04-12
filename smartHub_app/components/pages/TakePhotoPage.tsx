import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { getAddressString } from '../../utils/utilities';

var width : number = Dimensions.get('window').width;

export default class TakePhoto extends Component<{route: any, navigation: any}, {checkStream: boolean, profileId: number, hasStarted: boolean, deviceIP: String, userEmail: String, profileName: String}>{

    constructor(props: any){
        super(props);
        this.state= ({
            hasStarted: false,
            checkStream: false,
            deviceIP: "",
            profileId: 0,
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
            this.setState({profileId: response.data.device[0].profile_id})
        }, (error) => {
            console.log(error);
        })
    }
    
    beginStream = () => {
        if(!this.state.checkStream){
            var url = 'http://' + this.state.deviceIP + ':4000/video/start_stream';
            if(this.state.deviceIP !== 'lukessmarthub.ddns.net' &&  this.state.deviceIP !== "petepicam1234.zapto.org" && this.state.deviceIP !== "leohescamera.ddns.net"){
                alert(this.props.route.params.device_name + ' not compatible for live streaming.')
                return;
            }
            axios.post(url).then((response) => {
                this.setState({checkStream: true});
                Toast.show({
                    type: 'success',
                    text1: 'Processing Request Please Wait...',
                    visibilityTime: 5000
                })
                setTimeout(() => {
                    this.setState({hasStarted: true})
                    Toast.show({
                        type: 'success',
                        text1: 'The Stream Is Live!',
                        text2: 'Enjoy!',
                        visibilityTime: 4000
                    })
                }
                ,
                5000);
            }, (error) => {
                console.log(error);
            })
        }else if(this.state.checkStream){
            Toast.show({
                type: 'success',
                text1: 'The Stream Is Already Live!',
                text2: 'Click on the video player to view the stream.',
                visibilityTime: 2000
            })
        }
    }
    
    stopStream = () => {
        if(this.state.checkStream){
            var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
            if(this.state.deviceIP !== 'lukessmarthub.ddns.net' &&  this.state.deviceIP !== "petepicam1234.zapto.org" && this.state.deviceIP !== "leohescamera.ddns.net"){
                alert(this.props.route.params.device_name + ' not compatible for live streaming.')
                return;
            }
            axios.post(url).then((response) => {
                this.setState({checkStream: false})
                Toast.show({
                    type: 'error',
                    text1: 'Stop Stream Clicked!',
                    text2: 'The stream is no longer live.',
                    visibilityTime: 2000
                });
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

    // stopStreamOnBackClick = () => {
    //     var url = 'http://' + this.state.deviceIP + ':4000/video/stop_stream';
    //     if(this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net"){
    //         return;
    //     }
    //     if(this.state.hasStarted){
    //         axios.post(url).then((response) => {
    //             this.setState({hasStarted: false})
    //         }, (error) => {
    //             console.log(error);
    //         })
    //     }
    // }

    takePhoto = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/takeFaceImage';
        if(this.state.deviceIP !== 'lukessmarthub.ddns.net' &&  this.state.deviceIP !== "petepicam1234.zapto.org" && this.state.deviceIP !== "leohescamera.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible for photo taking.')
            return;
        }

        if(!this.state.checkStream){
            alert("You must begin the stream first");
            return;
        }

        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.state.profileName;
        collection.component_name = "Faces";
        collection.profile_id = this.state.profileId;

        Toast.show({
            type: 'success',
            text1:"Processing Please Wait...",
            visibilityTime: 6000
        });
        axios.post(url, collection).then((response) => {
            console.log(response.data)
            Toast.show({
                type: 'success',
                text1: response.data,
                visibilityTime: 2000
            });
        }, ({error,response}) : any => {
            Toast.show({
                type: 'success',
                text1: response.data,
                text2: "Please Try Again.",
                visibilityTime: 3000
            });
        })
    }

    checkStream = () => {
        var url = 'http://' + this.state.deviceIP + ':4000/video/stream_check';
        axios.post(url).then((response) => {
            this.setState({checkStream: response.data.streaming})
        }, (error) => {
            console.log(error);
        })
    }

    componentDidMount = async() => {
        await this.getDeviceIP();
        await this.checkStream();
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor: "#222222"}}>
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
