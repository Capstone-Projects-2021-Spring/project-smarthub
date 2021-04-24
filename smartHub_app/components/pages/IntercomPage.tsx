import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Stream from '../video/Streaming';

export default class Intercom extends Component<{ route: any, navigation: any }>{

    
    componentDidMount = async() => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
        })
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor: '#151621'}}>
                <Stream type={2} deviceId={this.props.route.params.device_id} navigation={this.props.navigation}/>
            </View>
        );
    }
}