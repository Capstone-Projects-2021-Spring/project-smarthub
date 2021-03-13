import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { DevicesList } from './lists/DevicesList';

export class LiveStreamingDevices extends Component<{route: any, navigation: any}>{
    render(){
        return (
            <DevicesList routeObject={this.props.route.params} stackScreen={'Live Stream'} navigation={this.props.navigation}/>
        )
    }
}

export class LiveRecordingDevices extends Component<{route: any, navigation: any}>{
    render(){
        return (
            <DevicesList routeObject={this.props.route.params} stackScreen={'Recording Devices'} navigation={this.props.navigation}/>
        )
    }
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
