import {View, Image, Text, Animated, Dimensions, Easing, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, { Component } from 'react';

import {styles} from "../../styles/style";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'native-base';
import SignUp from "./signUpPage";
import { NavigationActions, StackActions } from 'react-navigation';
import axios from 'axios';

const {height} = Dimensions.get("screen");

export default class Login extends Component<{navigation: any}>{

    

    state = {
        screenAnimation: new Animated.Value(height),
        inputAnimation: new Animated.Value(0),
        username: "",
        password: "",
        user_id: -1
    };


    AnimateContainer = () => {
        Animated.timing(this.state.screenAnimation, {
            toValue: height/3,
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

    signUpPressHandler(){
        this.props.navigation.navigate("Sign Up");
    }

    signInPressHandler(){
        // this.props.navigation.pop("Sign In");
        // StackActions.pop();
        // const resetAction = StackActions.reset({
        // index: 0,
        // actions: [NavigationActions.navigate({ routeName: "Home" })],
        // });
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate("Home", this.state.user_id);
        
    }

    userSignIn(){
        let collection: any = {}
        collection.email=this.state.username
        collection.password=this.state.password
        // console.warn(collection);

        var url = "https://b2bgr96nbc.execute-api.us-east-1.amazonaws.com/dev/user/login"
        
        axios.post(url, collection).then((response) => {
            this.state.user_id = response.data.user_id;
            this.signInPressHandler();
        }, ({error, response}) => {
            alert(response.data.message);
        })
    }

    
        
    render(){
        return(
            <Animated.View style={[styles.container, this.Animatedcontainer]}>
                <LinearGradient style={[styles.centerAlign, {height: "100%"}]} colors={["#FF9900", "#000000"]}>
                    
                </LinearGradient>
                <View style={[styles.centerAlign, {marginTop: 2, backgroundColor: "rgba(200,200,200,0.9", height: height}]}>
                    <Animated.View style={[styles.inputContainer, this.AnimatedInput]}>
                        <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>SIGN IN</Text>
                        <View style={{marginTop: 30, marginBottom: 10}}>
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="email" style={styles.input} onChangeText={(value) => this.setState({username: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} secureTextEntry={true} placeholder="password" style={styles.input} onChangeText={(value) => this.setState({password: value})} />
                        </View>
                        <View>
                            {/* <View style={{flex: 0.5}}>
                                <CheckBox style={{ width: 20, height: 20, borderColor: "#aaa"}} />
                                <Text style={{ marginLeft: 20}}>Remember Password</Text>
                            </View>
                            <View style={{flex: 0.5, alignItems: "flex-end"}}>
                                <TouchableOpacity>   
                                    <Text style={{color: "#c08"}}>Forgot Password</Text>
                                </TouchableOpacity>
                            </View> */}
                            <View style={{ alignItems: "center", marginTop: 20}}>
                                <TouchableOpacity onPress={() => {
                                    if(this.state.username.length != 0 && this.state.password.length != 0)
                                    {
                                        // this.signInPressHandler();
                                        this.userSignIn();
                                    }
                                    else{ alert("You must enter all credentials before signing in.")}
                                }}>   
                                    <LinearGradient style={{ width: 390/1.3, padding: 10, borderRadius: 20, }} colors={["#FF9900", "#000000"]}>
                                        <Text style={{color: "#FFFFFF", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Sign In</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: "center", marginTop: 20, flexDirection: "row", marginLeft: 35}}>
                                <Text style={{fontSize: 15}}>Don't Have An Account?</Text>
                                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => this.signUpPressHandler()}>   
                                        <Text style={{color: "#FF9900", fontSize: 15}}>Sign Up</Text>
                                    </TouchableOpacity>
                            </View> 
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>
        )
    }
}



