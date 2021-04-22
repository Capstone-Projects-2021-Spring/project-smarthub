import {View, Image, Text, Animated, Dimensions, Easing, Pressable, StyleSheet, ImageBackground} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, { Component } from 'react';

// import {styles} from "../../styles/style";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'native-base';
import SignUp from "./signUpPage";
import { NavigationActions, StackActions } from 'react-navigation';
import axios from 'axios';
import RoundedButton from '../buttons/RoundedButton';
import { greaterThan } from 'react-native-reanimated';
import RoundedTextInput from '../buttons/RoundedTextInput';

const {width, height} = Dimensions.get("screen");

const image = { uri: "smartHub_app/assets/Gordon_Ramsay.jpg" };

export default class Login extends Component<{navigation: any}>{

    constructor(props: any) {
        super(props);
        this.updateTypeHandler = this.updateTypeHandler.bind(this);
    }

    state = {
        screenAnimation: new Animated.Value(height),
        inputAnimation: new Animated.Value(0),
        email: "",
        password: "",
        user_id: -1,
    };


    //Animated background. height/3 for top third
    AnimateContainer = () => {
        Animated.timing(this.state.screenAnimation, {
            toValue: height,
            duration: 1500,
            useNativeDriver: false,
            easing: Easing.elastic(1.3),
        }).start();
    };

    AnimateInput = () => {
        Animated.timing(this.state.inputAnimation, {
            toValue: -height / 8,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    //Bounce animation
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

    AnimatedContainer = {
        height: this.state.screenAnimation
    };

    AnimatedInput = {
        transform: [
            {
                translateY: this.state.inputAnimation,
            }
        ]
    }

    //Updates the type of input box / sets state with new text.
    updateTypeHandler(type: string, value: string) {
        //Printing state in here will show that it's one character behind because setState is async, but it should be a problem in the rest of the app.
        if(type === "email") {
            this.setState({email : value});
        }
        else if(type === "password") {
            this.setState({password : value});
        }
        else {
            console.log("ERROR! Invalid state from input text.");
        }
    }

    signUpPressHandler(){
        this.props.navigation.navigate("Sign Up");
    }

    signInPressHandler(){
        console.log(this.state.user_id);
        this.props.navigation.navigate("Home", this.state.user_id);
        
    }

    userSignIn(){
        let collection: any = {}
        collection.email=this.state.email
        collection.password=this.state.password
        // console.warn(collection);

        var url = "https://m3257rqtq8.execute-api.us-east-1.amazonaws.com/dev/user/login"
        
        axios.post(url, collection).then((response) => {
            this.state.user_id = response.data.user_id;
            
            this.signInPressHandler();
        }, ({error, response}) => {
            console.log(error);
            alert(response.data.message);
        })
    }

    
    
    render(){
        return(
            // Opening animation.
            <Animated.View style={[this.AnimatedContainer]}>
                {/* <LinearGradient style={[styles.centerAlign, {height: "30%"}]} colors={["#E0A458", "#000000"]} /> */}

                {/* <LinearGradient style={[{height: "10%"}]} colors={["rgba(21,22,33,1) 0%", "rgba(28,28,41,1) 35%", "rgba(53,53,72,1) 49%", "rgba(172,130,83,1) 78%", "rgba(224,164,88,1) 100%"]} /> */}
                {/* View that gets animated. Background. */}
                <View style={[styles.background]}>
                    
                    {/* Input fields animation. */}
                    <Animated.View style={[this.AnimatedInput]}>
                        
                        <View style={[styles.signUpContainer]}>
                            <Text style={{textAlign: "center", color: "#E0A458", fontSize: 25}}>Sign In</Text>

                            <View style={[]}>
                                <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="email" inputType={this.updateTypeHandler}/>
                                <RoundedTextInput onBlur={this.reverseAnimateInput} onFocus={this.AnimateInput} placeholder="password" inputType={this.updateTypeHandler}/>
                            </View>

                            <View>

                                <View style={[]}>
                                    
                                    {/* Sign In Button */}
                                    <RoundedButton onPress={this.userSignIn} buttonText="Sign In" />
                                    
                                </View>
                                <View style={[]}>
                                    <Text style={[]}>Don't Have An Account?</Text>
                                        <TouchableOpacity style={[]} onPress={() => this.signUpPressHandler()}>   
                                            <Text style={[]}>Sign Up</Text>
                                        </TouchableOpacity>
                                </View> 
                            </View>
                        </View>
                        
                    </Animated.View>
                </View>
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
        marginTop: "80%",
        padding: "4%",
        minHeight: 400,
        borderRadius: 20,
    },

    signIn: {
        backgroundColor: "#E0A458",

    }

});



