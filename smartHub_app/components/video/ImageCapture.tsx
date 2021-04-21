import axios from 'axios';
import Toast from 'react-native-toast-message'
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RoundedButton from '../buttons/RoundedButton';
var width: number = Dimensions.get('window').width;


export default class ImageCapture extends Component<{deviceIP: String, userEmail: String, profileName: String}, {checkStream: boolean}>{

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

    takePhoto = async() => {
        var url = 'http://' + this.props.deviceIP + ':4000/video/take_image';
        if (this.props.deviceIP !== 'petepicam1234.zapto.org' && this.props.deviceIP !== "leohescamera.ddns.net"
            && this.props.deviceIP !== 'lukessmarthub.ddns.net' && this.props.deviceIP !== '192.168.86.244') {
            alert('Device not compatible for photo taking.')
            return;
        }
        let collection: any = {}
        collection.user_email = this.props.userEmail;
        collection.profile_name = this.props.profileName;
        collection.component_name = "Images";

        await this.checkStream();
        if(this.state.checkStream){
        axios.post(url, collection).then((response) => {
            // alert("Stopping Recording");
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
        }else{
            alert('The stream must be started to take a photo.')
        }
    }

    render(){
        return(
            <View style={{ alignItems: 'center' }}>
                <RoundedButton
                    onPress={this.takePhoto}
                    buttonText={"Take Photo"}>
                </RoundedButton>
            </View>      
        );
    }
}

const styles = StyleSheet.create({

photoButton: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: width - 75,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#E0A458',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
},
})