import React, { Component } from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {styles} from "../styles/customButtonStyle";

const {width, height} = Dimensions.get("screen");

interface Ibutton {
    onPress: any;
    buttonText: string;
}

export default class RoundedButton extends Component<Ibutton>{
    constructor(props: any) {
        super(props);
    }
    
    render(){
        return(
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <Text style={styles.textStyle}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        )
    }
}

// const RoundedButton = (props:any) => {

//     // constructor(props: any) {
        
//     // }

//     return (
        
//             <TouchableOpacity style={styles.container}>
//                  <Text style={styles.textStyle}>{props.buttonText}</Text>
//             </TouchableOpacity>
           
        
//     );
// };

const styles = StyleSheet.create ({
    container: { 
        width: width/1.25,
        height: height/18,
        borderRadius: 30,
        backgroundColor: '#1C1D2B',
        borderColor: '#E0A458',
        borderWidth: 2,
        padding: 5,
        margin: 10,
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 20,
        // fontFamily: '',
        color: '#FFFFFF',
    }
})

// export default RoundedButton;