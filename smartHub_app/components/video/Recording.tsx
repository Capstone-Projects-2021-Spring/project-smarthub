import axios from 'axios';
import Toast from 'react-native-toast-message'
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';

export default class Record extends Component<{deviceIP: String, userEmail: String, profileName: String}, {checkStream: boolean}>{

    constructor(props: any) {
        super(props);
        this.state = ({
            checkStream: false
        })
    }

    checkStream = async () => {
        var url = 'http://' + this.props.deviceIP + ':4000/video/stream_check';
        console.log(url)
        await axios.post(url).then((response) => {
            this.setState({checkStream: response.data.streaming})
            console.log(response.data)
        }, ({error, response}) => {
            console.log(response.data)
            console.log(error);
        })
    }

    startRecord = async() => {
        var url = 'http://' + this.props.deviceIP + ':4000/video/start_recording';
        // if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
        //     alert(this.props.route.params.device_name + ' not compatible for recording.')
        //     return;
        // }
        await this.checkStream();
        if(this.state.checkStream){
            axios.post(url).then((response) => {
                this.setState({checkStream: true})
                // alert("Recording");

                Toast.show({
                    type: 'success',
                    text1: 'Start Record Clicked!',
                    text2: 'The Recording is live.',
                    visibilityTime: 2000
                });
            }, (error) => {
                alert("Error Starting Recording");
                console.log(error);
            })
        } else if(!this.state.checkStream) {
            alert("The Stream must be started first.")
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Recording has already started!',
                visibilityTime: 2000
            })
        }
    }

    stopRecord = async() => {
        var url = 'http://' + this.props.deviceIP + ':4000/video/stop_recording';
        // if (this.state.deviceIP !== 'petepicam1234.zapto.org' && this.state.deviceIP !== "leohescamera.ddns.net") {
        //     alert(this.props.route.params.device_name + ' not compatible for recording.')
        //     return;
        // }
        //console.log(url);
        let collection: any = {}
        collection.user_email = this.props.userEmail;
        collection.profile_name = this.props.profileName;
        collection.component_name = "Videos";
        await this.checkStream();
        if(this.state.checkStream){
            axios.post(url, collection).then((response) => {
                // alert("Stopping Recording");
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
            alert("You must start a recording first")
        }
    }

    render(){
        return(
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
}

})