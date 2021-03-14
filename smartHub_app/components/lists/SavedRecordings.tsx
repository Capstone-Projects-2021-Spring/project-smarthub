// import { Video } from 'expo';
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import axios from 'axios';
import { List } from 'native-base';
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


export class PlayVideos extends Component<{navigation: any, stackScreen: string, routeObject: any}, {retrievedVideo: any, recordingsList: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            retrievedVideo: "",
            recordingsList : []
        });
    }

    getRecordingsFromProfile = () => {
        let collection: any = {}
        collection.user_email = this.props.routeObject.userEmail;
        console.log(collection.user_email)
        collection.profile_name = this.props.routeObject.item.profileName;
        console.log(collection.profile_name)
    
        axios.post('http://192.168.86.202:5000/get_key_list', collection).then((response) => {
            this.setState({recordingsList: response.data.keyList});
            
            this.getFileFromProfile();
            // this.trimRecordingsList();
        }, (error) => {
            console.log(error);
        })
    }

    getFileFromProfile = () => {
        let collection: any = {}
        console.log(this.state.recordingsList[1]);
        collection.key = this.state.recordingsList[1];
        console.log(collection.key);
    
        axios.post('http://192.168.86.202:5000/get_file', collection).then((response) => {
            // this.setState({recordingsList: response.data.keyList});
            this.setState({retrievedVideo: response.data.video.Body})
            console.log(this.state.retrievedVideo);
        }, (error) => {
            console.log(error);
        })
    }

    // trimRecordingsList = () => {
    //     for(let i = 0; i < this.state.recordingsList.length; i++)
    //     {
    //         this.state.recordingsList[i] = this.state.recordingsList[i].substring(this.state.recordingsList[i].lastIndexOf("/") + 1);
    //     }
    //     console.log(this.state.recordingsList);
    // }

    componentDidMount = () => {
        this.getRecordingsFromProfile();
    }
    
    render(){
        // console.log(this.props.routeObject);
        return (
            // <List>

            // </List>
            
            // getRecordings();
            <View style={styles.container}>
                
                <Video
                    source={{uri: "https://sh-video-storage.s3.us-east-2.amazonaws.com/dep15%40gmail.com/123_Sample_Street/vid_Sun_Mar_14_2021_00%3A48%3A12_GMT-0500_%28Eastern_Standard_Time%29?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2LQILJ5CSW5Q4RNB%2F20210314%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210314T083812Z&X-Amz-Expires=300&X-Amz-Signature=487a43ab3f5ddfddeb238c2a20745f244da5f92de7fba7751ceec8661a6b0971&X-Amz-SignedHeaders=host"}}
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
