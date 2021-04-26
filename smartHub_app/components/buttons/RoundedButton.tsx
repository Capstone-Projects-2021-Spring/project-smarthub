import React, { Component } from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {styles} from "../styles/customButtonStyle";

const {width, height} = Dimensions.get("screen");

interface Ibutton {
    onPress: any;
    buttonText: string;
    buttonColor?: string; 
}

export default class RoundedButton extends Component<Ibutton>{
    constructor(props: any) {
        super(props);
    }
    
    render(){        
        var buttonColor = this.props.buttonColor || '#1C1D2B';        
        return(
            <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: buttonColor}]} onPress={this.props.onPress}>
                <Text style={styles.textStyle}>{this.props.buttonText}</Text>
            </TouchableOpacity>

            // <Shadow distance={12} size={[width/1.29,height/23]} offset={[15,16]} radius={20} startColor={"#E0A458"} finalColor={"transparent"} >
                
            // </Shadow>
        )
    }
}

const styles = StyleSheet.create ({
    buttonStyle: { 
        width: width/1.25,
        height: height/18,
        borderRadius: 30,
        // backgroundColor: '#1C1D2B',
        borderColor: '#E0A458',
        borderWidth: 2,
        padding: 5,
        margin: 10,
        // elevation: 15
    },
    textStyle: {
        textAlign: 'center',
        fontSize: width/20,
        paddingTop: 3,
        // fontFamily: '',
        color: '#FFFFFF',
    }
})