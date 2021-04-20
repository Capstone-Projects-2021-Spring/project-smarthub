import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Stream from '../video/Streaming';

export default class TakePhoto extends Component<{ route: any, navigation: any }>{

    componentDidMount = async() => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
        })
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor: "#222222"}}>
                <Stream type={3} deviceId={this.props.route.params.device_id} navigation={this.props.navigation}/>
            </View>
        );
    }
}