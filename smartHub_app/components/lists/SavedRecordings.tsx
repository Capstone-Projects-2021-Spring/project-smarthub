// import { Video } from 'expo';
import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

export class PlayVideos extends Component<{navigation: any, stackScreen: string, route: any}, {retrievedVideo: any, recordingsList: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            retrievedVideo: "",
            recordingsList : []
            
        });
    }
    
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
                    useNativeControls={true}
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
      backgroundColor: '#151621',
    },
    video: {
      alignSelf: 'center',
      width: 400,
      height: 600,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
});