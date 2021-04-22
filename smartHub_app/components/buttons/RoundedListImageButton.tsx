import React, { Component } from 'react';
import {StyleSheet, View, Dimensions, Text, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {styles} from "../styles/customButtonStyle";

const {width, height} = Dimensions.get("screen");

interface Ibutton {
    onPress: any;
    imageLink: any;
    buttonText: string;
}

export default class RoundedListImageButton extends Component<Ibutton>{
    constructor(props: any) {
        super(props);
    }
    
    render(){
        return(
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <Text style={styles.textStyle}>{this.props.buttonText}</Text>
                <Image style={styles.ImageStyle} source={{uri: this.props.imageLink}}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create ({
    container: { 
        justifyContent: 'center',
        alignSelf: 'center',
        width: width/1.15,
        height: height/9,
        backgroundColor: '#1C1D2B',
        borderColor: '#E0A458',
        borderWidth: 2,
        borderRadius: 8,
        padding: 5,
        marginTop: 30,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    textStyle: {
        textAlign: 'center',
        fontSize: width/18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    ImageStyle: {
        width: "20%",
        height: "80%",
        position: 'absolute',
        left:0,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1D2B',
    },
})