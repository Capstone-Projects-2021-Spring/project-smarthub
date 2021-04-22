import React, { Component } from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';
// import {styles} from "../styles/customButtonStyle";

const {width, height} = Dimensions.get("screen");

interface SmartHubInput {
    //onPress: any;
    placeholder: string;
    onBlur: any;
    onFocus: any;
    inputType: any;

}


//,{usingText: string, usingFunction: any}
export default class RoundedTextInput extends Component<SmartHubInput>{
    constructor(props: any) {
        super(props);
    }
    
    render(){
        return(
            <Shadow distance={10} size={[320,40]} offset={[5,15]} radius={20} startColor={"#E0A458"} finalColor={"transparent"} >
                <TextInput
                    onBlur={ () => this.props.onBlur()}
                    onFocus={() => this.props.onFocus()}
                    placeholder= {this.props.placeholder}
                    placeholderTextColor="#E0A458"
                    style={[styles.textField]}
                    onChangeText={(value) => this.props.inputType(this.props.placeholder, value)}
                />
            </Shadow>
            
        )
    }
}

// const RoundedButton = (props:any) => {

//     // constructor(props: any) {
        
//     // }

//     return (
        
//             <TouchableOpacity style={styles.container}>
//                  <Text style={styles.textStyle}>{props.buttonText1}</Text>
//             </TouchableOpacity>
           
        
//     );
// };

const styles = StyleSheet.create ({
    textField: {
        width: width/1.25,
        height: height/18,
        // borderColor: "#E0A458",
        borderRadius: 100,
        // borderWidth: 2,
        backgroundColor: "white",
        color: "#E0A458",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
    },
})

// export default RoundedButton;