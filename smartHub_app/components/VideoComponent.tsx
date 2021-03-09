import React from 'react';
import {View, Text} from 'react-native';
import Streaming from './Streaming';

export function LiveStream(){
    return (
        <Streaming />
    )
}

export function Record(){
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
