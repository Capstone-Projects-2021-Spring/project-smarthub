import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { DevicesList } from './lists/DevicesList';
import { PlayVideos } from './lists/SavedRecordings';

export class LiveStreamingDevices extends Component<{route: any, navigation: any}>{
    render(){
        return (
            <DevicesList routeObject={this.props.route.params} stackScreen={'Streaming Devices'} navigation={this.props.navigation}/>
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

export class SavedRecordings extends Component<{routeObject: any, navigation: any}>{
    render(){
        return (
            <PlayVideos routeObject={this.props.routeObject.params} stackScreen={'Saved Recordings'} navigation={this.props.navigation}/>
        );
    }
}

export function SavedImages(){
    return (
        <View>
            <Text>Need to grab all images taken by user here</Text>
        </View>
    );
}
