import React, { Component } from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {styles} from "../styles/customButtonStyle";

const {width, height} = Dimensions.get("screen");

interface Ibutton {
    onPress: any;
    // function2: any;
    buttonText: string;
    // buttonText2: string;
}
//,{usingText: string, usingFunction: any}
export default class RoundedButton extends Component<Ibutton>{
    constructor(props: any) {
        super(props);
    }

    // state = {
    //     usingText: this.props.buttonText1,
    //     usingFunction: this.props.onPress
    // }

    // changeButtonText()
    // {
    //     // if()
    //     if(this.state.usingText == this.props.buttonText1)
    //     {         
    //         this.props.onPress();   
    //         var text = this.props.buttonText2;
    //         this.setState({
    //             usingText: text,            
    //         });
    //     }
    //     else if(this.state.usingText == this.props.buttonText2)
    //     {
    //         this.props.function2();   
    //         var text = this.props.buttonText1;
    //         this.setState({
    //             usingText: text,            
    //         });
    //     }
        
    //     // this.props.buttonText2: this.changeButtonText;
    // }
    
    render(){
        return(
            <TouchableOpacity style={styles.container} onPress={this.props.onPress
                // this.changeButtonText();}
            }>
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
//                  <Text style={styles.textStyle}>{props.buttonText1}</Text>
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