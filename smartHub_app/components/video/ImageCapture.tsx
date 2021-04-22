import axios from 'axios';
import Toast from 'react-native-toast-message'
import React, { Component } from 'react';
import prompt from 'react-native-prompt-android';
import * as FileSystem from 'expo-file-system';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RoundedButton from '../buttons/RoundedButton';
var width: number = Dimensions.get('window').width;


export default class ImageCapture extends Component<{profileId: number, type: String, deviceIP: String, userEmail: String, profileName: String}, {checkStream: boolean}>{

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
        await this.checkStream();
        if(this.state.checkStream){
            if(this.props.type === "Face Capture"){ 
                prompt(
                'Enter an image name:',
                '',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: async (imageName: string) => { 
                        console.log('OK Pressed, imageName: ' + imageName);
                            var collection = {
                                image_name: imageName,
                                user_email: this.props.userEmail,
                                profile_name: this.props.profileName,
                                component_name: "Faces",
                                profile_id: this.props.profileId,
                            }
                            // Toast.show({
                            //     type: 'error',
                            //     text1: "Processing Please Wait...",
                            //     visibilityTime: 5000
                            // });
                            alert("Processing Please Wait...");
                            axios.post('http://' + this.props.deviceIP + ':4000/video/takeFaceImage', collection).then((response) => {
                                // Toast.show({
                                //     type: 'success',
                                //     text1: response.data,
                                //     visibilityTime: 2000
                                // })
                                alert(response.data);
                                console.log(response.data)
                            }, ({error, response}) : any => {
                                console.log(error)
                                // Toast.show({
                                //     type: 'error',
                                //     text1: response.data,
                                //     text2: 'Please Try again...',
                                //     visibilityTime: 2000
                                // });
                                alert(response.data);
                            })
                            
                    }
                }
            ],
            {
                cancelable: false,
            });
            }else{
                let collection: any = {}
                collection.user_email = this.props.userEmail;
                collection.profile_name = this.props.profileName;
                collection.component_name = "Images";
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
            }
        }else{
            alert('The stream must be started to take a photo.')
        }
    }

    render(){
        return(
            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
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