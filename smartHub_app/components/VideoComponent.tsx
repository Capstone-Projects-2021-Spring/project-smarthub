import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { DevicesList } from './lists/DevicesList';

export function LiveStreamingDevices({ navigation } : {navigation: any}){
    return (
        <DevicesList stackScreen={'Live Stream'} navigation={navigation}/>
    )
}

export function LiveRecordingDevices({ navigation } : {navigation: any}){
    return (
        <DevicesList stackScreen={'Recording Devices'} navigation={navigation}/>
    )
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
