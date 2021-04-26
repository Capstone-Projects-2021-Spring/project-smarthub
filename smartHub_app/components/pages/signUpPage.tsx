import {View, Image, Text, Animated, Dimensions, Easing, Pressable, StyleSheet, ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, { Component } from 'react';

;
// import {styles} from "../../styles/signUpStyle";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'native-base';
import axios from 'axios';
import RoundedButton from '../buttons/RoundedButton';
import RoundedTextInput from '../buttons/RoundedTextInput';

const {height} = Dimensions.get("screen");

export default class SignUp extends Component<{navigation: any}>{

    constructor(props: any) {
        super(props);
        this.updateTypeHandler = this.updateTypeHandler.bind(this);
        this.userSignUp = this.userSignUp.bind(this);
    }

    //Updates the type of input box / sets state with new text.
    updateTypeHandler(type: string, value: string) {
        //Printing state in here will show that it's one character behind because setState is async, but it should be a problem in the rest of the app.
        // if(type === "email") {
        //     this.setState({email : value});
        // }
        // else if(type === "password") {
        //     this.setState({password : value});
        // }
        // else {
        //     console.log("ERROR! Invalid state from input text.");
        // }
        console.log(type + " " + value);
        switch(type) {
            case "first name":
                this.setState({firstName: value});
                break;
            case "last name":
                this.setState({lastName: value});
                break;
            case "phone":
                this.setState({phoneNumber: value});
                break;
            case "email":
                this.setState({email: value});
                break;
            case "password":
                this.setState({password: value});
                break;
            case "confirm password":
                this.setState({passwordConfirmation: value});
                break;
        }
    }

    state = {
        screenAnimation: new Animated.Value(height),
        inputAnimation: new Animated.Value(0),
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        user_id: -1,
    };

    AnimateContainer = () => {
        Animated.timing(this.state.screenAnimation, {
            toValue: height/5,
            duration: 1500,
            useNativeDriver: false,
            easing: Easing.elastic(1.3),
        }).start();
    };

    AnimateInput = () => {
        Animated.timing(this.state.inputAnimation, {
            toValue: -height / 5,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    reverseAnimateInput = () => {
        Animated.timing(this.state.inputAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    componentDidMount() {
        this.AnimateContainer();
    }

    Animatedcontainer = {
        height: this.state.screenAnimation
    };

    AnimatedInput = {
        transform: [
            {
                translateY: this.state.inputAnimation,
            }
        ]
    }

    

    signInPressHandler(){
        this.props.navigation.navigate("Sign In");
    }

    signUpPressHandler(){
        this.props.navigation.navigate("Home", this.state.user_id);
    }

    userSignUp(){
        let collection: any = {}
        collection.first_name = this.state.firstName;
        collection.last_name = this.state.lastName;
        collection.email = this.state.email;
        collection.phone_number = this.state.phoneNumber;
        collection.password = this.state.password;
        collection.confirm_password = this.state.passwordConfirmation;
        console.log(collection.phone_number);

        var url = "https://m3257rqtq8.execute-api.us-east-1.amazonaws.com/dev/user/register"
        
        axios.post(url, collection).then((response) => {
            this.state.user_id = response.data.user_id;
            console.log(response.data);
            console.log(this.state.user_id);
            this.signUpPressHandler();
        }, ({error, response}) => {
            console.log(error);
            console.log(response.status);
            // alert(response.data.message);
        })
    }


        
    render(){
        return(
            // Opening animation.
            <Animated.View style={[]}>
                {/* <LinearGradient style={[styles.centerAlign, {height: "30%"}]} colors={["#E0A458", "#000000"]} /> */}

                <LinearGradient style={[{height: "100%"}]} colors={["rgba(21,22,33,1) 0%", "rgba(28,28,41,1) 35%", "rgba(53,53,72,1) 49%", "rgba(172,130,83,1) 78%", "rgba(224,164,88,1) 100%"]} >
                {/* View that gets animated. Background. */}
                    <View style={[]}>
                        
                        {/* Input fields animation. */}
                        <Animated.View style={[this.AnimatedInput]}>
                            
                            <View style={[styles.signUpContainer]}>
                                <Text style={{textAlign: "center", color: "#E0A458", fontSize: 25, marginBottom: 10}}>Sign Up</Text>
                                <ScrollView style={[{paddingLeft: 0}]} showsVerticalScrollIndicator={false}>
                                    <View style={[]}>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="first name" inputType={this.updateTypeHandler}/>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="last name" inputType={this.updateTypeHandler}/>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="phone" inputType={this.updateTypeHandler}/>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="email" inputType={this.updateTypeHandler}/>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="password" inputType={this.updateTypeHandler} secure={true}/>
                                            <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="confirm password" inputType={this.updateTypeHandler} secure={true}/>
                                        
                                    </View>

                                    
                                </ScrollView>
                                <View>

                                    <View style={[{marginLeft: -5}]}>
                                        
                                        {/* Sign In Button */}
                                        <RoundedButton onPress={this.userSignUp} buttonText="Sign Up" buttonColor="#E0A458"/>
                                        
                                    </View>
                                    <View style={[]}>
                                        <Text style={[{textAlign: "center", marginTop: 10}]}>
                                            Already have an account? <Text style={[{color: "#E0A458"}]} onPress={() => this.signInPressHandler()}>Sign In</Text>
                                        </Text>
                                    </View> 
                                </View>
                            </View>                                                
                        </Animated.View>
                    </View>
                </LinearGradient>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "linear-gradient( "
                        + "rgba(21,22,33,1) 0%," //Dark Blue
                        + "rgba(28,28,41,1) 35%," 
                        + "rgba(53,53,72,1) 49%,"
                        + "rgba(172,130,83,1) 78%,"
                        + "rgba(224,164,88,1) 100%" //Orange
                        + ")",
        // backgroundColor: "linear-gradient( "
        //                 + "0deg,"
        //                 + "rgb(255,0,0) 0%," //Dark Blue
        //                 + "rgb(0,255,0) 40%,"
        //                 + "rgb(0,0,255) 60%" //Orange
        //                 + ")",
        // backgroundColor: "background: linear-gradient(0deg, rgba(172,130,83,1) 5%, rgba(28,28,41,1) 8%, rgba(53,53,72,1) 9%, rgba(21,22,33,1) 20%, rgba(224,164,88,1) 100%)",
        height: "100%"
    },

    signUpContainer: {
        backgroundColor: "white",
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "50%",
        padding: "4%",
        minHeight: 400,
        borderRadius: 20,
        maxHeight: 400,
    },

    signIn: {
        backgroundColor: "#E0A458",

    }

});



