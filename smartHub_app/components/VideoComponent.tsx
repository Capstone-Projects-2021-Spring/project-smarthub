import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { DevicesList } from './lists/DevicesList';
import { PlayVideos } from './lists/SavedRecordings';
import { SavedRecordingsList } from './lists/SavedRecordingsList';
import { SavedImagesList } from './lists/SavedImagesList';

// STREAMING
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
            <SavedRecordingsList routeObject={this.props.routeObject.params} navigation={this.props.navigation}/>
            // <PlayVideos routeObject={this.props.routeObject.params} stackScreen={'Saved Recordings'} navigation={this.props.navigation}/>
        );
    }
}

export class SavedImages extends Component<{routeObject: any, navigation: any}>{
    render(){
        return (
            <SavedImagesList routeObject={this.props.routeObject.params} navigation={this.props.navigation}/>
        );
    }
}
