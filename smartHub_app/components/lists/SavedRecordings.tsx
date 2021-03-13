// import { Video } from 'expo';
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
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


export class PlayVideos extends Component<{navigation: any, stackScreen: string, routeObject: any}>{
    render(){
        return (
            <View style={styles.container}>
                <Video
                    source={{uri: 'http://dl5.webmfiles.org/big-buck-bunny_trailer.webm'}}
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