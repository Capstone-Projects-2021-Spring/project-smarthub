import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'
import hexRgb from 'hex-rgb'
import axios from 'axios';

export default class SmartLight extends Component{

    changeLightSingleColor(obj: any){
        obj.brightness = 250;
        obj.randomize = false;
        //console.log(obj);
        axios.post("http://johnnyspi.ddns.net:8000/lights", obj) .then((response) => {
            console.log(response.data)
        }, (error) => {
            console.log(error);
        })
    }

    render(){
        return(
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <ColorPicker
                    onColorSelected={(color:any) => (this.changeLightSingleColor(hexRgb(color)))}
                    hideSliders={false}
                    style={{width: "90%", height: "50%"}}
                />
          </View>
        )
    }
}
