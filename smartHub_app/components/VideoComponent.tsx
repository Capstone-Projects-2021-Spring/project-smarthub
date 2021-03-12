import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { StreamingDevicesList } from './lists/StreamingDevicesList';

export function LiveStreamingDevices({ navigation } : {navigation: any}){
    return (
        <StreamingDevicesList navigation={navigation}/>
    )
}

export function RecordingDevices(){
    return (
        <View>
            <Text>Need to implement record functionality here</Text>
        </View>
    );
}

export function SavedRecordings(){
    return (
        <View>
            <Text>Need to grab all recordings from s3 and place them here</Text>
        </View>
    );
}

export function SavedImages(){
    return (
        <View>
            <Text>Need to grab all images taken by user here</Text>
        </View>
    );
}
