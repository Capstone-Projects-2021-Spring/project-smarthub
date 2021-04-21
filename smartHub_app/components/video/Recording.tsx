import axios from 'axios';
import Toast from 'react-native-toast-message'
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RoundedButton from '../buttons/RoundedButton';

export default class Record extends Component<{deviceIP: String, userEmail: String, profileName: String}, {checkStream: boolean, recordText: string, recordFunction: any}>{

    constructor(props: any) {
        super(props);
        this.state = ({
            checkStream: false,
            recordText: "Start Record",
            recordFunction: this.startRecord,
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
        if (this.props.deviceIP !== 'petepicam1234.zapto.org' && this.props.deviceIP !== "leohescamera.ddns.net"
            && this.props.deviceIP !== 'lukessmarthub.ddns.net'  && this.props.deviceIP !== '192.168.86.244') {
            alert('Device not compatible for Recording.')
            return;
        }
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

                this.setState({recordFunction: this.stopRecord, recordText:"Stop Record"});
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
        if (this.props.deviceIP !== 'petepicam1234.zapto.org' && this.props.deviceIP !== "leohescamera.ddns.net"
            && this.props.deviceIP !== 'lukessmarthub.ddns.net' && this.props.deviceIP !== '192.168.86.244') {
            alert('Device not compatible for Recording.')
            return;
        }
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
                this.setState({recordFunction: this.startRecord, recordText:"Start Record"});
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
            <RoundedButton
                onPress={this.state.recordFunction}
                buttonText={this.state.recordText}>
            </RoundedButton>
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
    backgroundColor: '#E0A458',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
}

})