// import { Video } from 'expo';
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import axios from 'axios';
import { List } from 'native-base';
import { getAddressString } from '../../utils/utilities';
// import * as VideoThumbnails from 'expo-video-thumbnails';

const Videos = [
{
    Videourl: 'https://www.youtube.com/watch?v=2LqzF5WauAw&ab_channel=InterstellarMovie',
},
{
    Videourl: 'https://www.youtube.com/watch?v=_9L3j-lVLwk&ab_channel=YoungThug',
},
{
    Videourl: 'https://www.youtube.com/watch?v=nopWOC4SRm4&ab_channel=ComedyCentral',
},
];


export class PlayVideos extends Component<{navigation: any, stackScreen: string, route: any}, {retrievedVideo: any, recordingsList: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            retrievedVideo: "",
            recordingsList : []
            
        });
    }

    // getRecordingsFromProfile = () => {
    //     let collection: any = {}
    //     collection.user_email = this.props.routeObject.userEmail;
    //     console.log(collection.user_email)
    //     collection.profile_name = this.props.routeObject.item.profileName;
    //     console.log(collection.profile_name)
    
    //     axios.post(getAddressString() + '/get_key_list', collection).then((response) => {
    //         this.setState({recordingsList: response.data.keyList});
            
    //         this.getFileFromProfile();
    //         // this.trimRecordingsList();
    //     }, (error) => {
    //         console.log(error);
    //     })
    // }

    // getFileFromProfile = () => {
    //     let collection: any = {}
    //     console.log(this.state.recordingsList[1]);
    //     collection.key = this.state.recordingsList[1];
    //     console.log(collection.key);
    
    //     axios.post(getAddressString() + '/get_file', collection).then((response) => {
    //         // this.setState({recordingsList: response.data.keyList});
    //         this.setState({retrievedVideo: response.data.video.Body})
    //         console.log(this.state.retrievedVideo);
    //     }, (error) => {
    //         console.log(error);
    //     })
    // }

    // trimRecordingsList = () => {
    //     for(let i = 0; i < this.state.recordingsList.length; i++)
    //     {
    //         this.state.recordingsList[i] = this.state.recordingsList[i].substring(this.state.recordingsList[i].lastIndexOf("/") + 1);
    //     }
    //     console.log(this.state.recordingsList);
    // }

    // componentDidMount = () => {
    //     this.getFileFromProfile();
    // }
    
    render(){
        console.log(this.props.route);
        return (
            // <List>

            // </List>
            
            // getRecordings();
            <View style={styles.container}>
                
                <Video
                    source={{uri: this.props.route.params}}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.video}
                />
            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
});

// function getRecordings() {
//     var path: "";
    
//     axios.post(path).then((response) => {
//     }, ({error, response}) => {
//         alert(response.data.message);
//     })
//     throw new Error('Function not implemented.');
// }
