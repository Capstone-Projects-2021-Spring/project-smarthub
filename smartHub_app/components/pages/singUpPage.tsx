import {View, Image, Text, Animated, Dimensions, Easing, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, { Component } from 'react';

;
import {styles} from "../../styles/signUpStyle";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'native-base';

const {height} = Dimensions.get("screen");

export default class SignUp extends Component<{navigation: any}>{
    state = {
        screenAnimation: new Animated.Value(height),
        inputAnimation: new Animated.Value(0),
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
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
        this.props.navigation.navigate("Home");
    }
        
    render(){
        return(
            <Animated.View style={[styles.container, this.Animatedcontainer]}>
                <LinearGradient style={[styles.centerAlign, {height: "100%"}]} colors={["#FF9900", "#000000"]}>
                    
                </LinearGradient>
                <View style={[styles.centerAlign, {marginTop: 2, backgroundColor: "rgba(200,200,200,0.9", height: height}]}>
                    <Animated.View style={[styles.inputContainer, this.AnimatedInput]}>
                        <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>SIGN UP</Text>
                        <View style={{marginTop: 30, marginBottom: 10}}>
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="first name" style={styles.input} onChangeText={(value) => this.setState({firstName: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="last name" style={styles.input} onChangeText={(value) => this.setState({lastName: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="email" style={styles.input} onChangeText={(value) => this.setState({email: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} secureTextEntry={true} placeholder="password" style={styles.input} onChangeText={(value) => this.setState({password: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} secureTextEntry={true} placeholder="confirm password" style={styles.input} onChangeText={(value) => this.setState({passwordConfirmation: value})} />
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
                                    if(this.state.firstName.length == 0 || this.state.lastName.length == 0 || this.state.email.length == 0 || this.state.password.length == 0 || this.state.passwordConfirmation.length == 0)
                                    {
                                        
                                        alert("You must enter all credentials before signing in.")
                                    }
                                    else if(this.state.password != this.state.passwordConfirmation)
                                    {
                                        alert("Passwords do not match.");
                                    }
                                    else{this.signUpPressHandler();}
                                }}>   
                                    <LinearGradient style={{ width: 390/1.3, padding: 10, borderRadius: 20, }} colors={["#FF9900", "#000000"]}>
                                        <Text style={{color: "#FFFFFF", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Sign Up</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: "center", marginTop: 20, flexDirection: "row", marginLeft: 85}}>
                                <Text style={{fontSize: 15}}>Go Back To</Text>
                                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => this.signInPressHandler()}>   
                                        <Text style={{color: "#FF9900", fontSize: 15}}>Login</Text>
                                    </TouchableOpacity>
                            </View> 
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>
        )
    }
}



