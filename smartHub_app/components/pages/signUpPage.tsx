import {View, Image, Text, Animated, Dimensions, Easing, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, { Component } from 'react';

;
import {styles} from "../../styles/signUpStyle";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'native-base';
import axios from 'axios';

const {height} = Dimensions.get("screen");

export default class SignUp extends Component<{navigation: any}>{
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
            <Animated.View style={[styles.container, this.Animatedcontainer]}>
                <LinearGradient style={[styles.centerAlign, {height: "100%"}]} colors={["#FF9900", "#000000"]}>
                    
                </LinearGradient>
                <View style={[styles.centerAlign, {marginTop: 2, backgroundColor: "rgba(200,200,200,0.9", height: height}]}>
                    <Animated.View style={[styles.inputContainer, this.AnimatedInput]}>
                        <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>SIGN UP</Text>
                        <View style={{marginTop: 30, marginBottom: 10}}>
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="first name" style={styles.input} onChangeText={(value) => this.setState({firstName: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="last name" style={styles.input} onChangeText={(value) => this.setState({lastName: value})} />
                            <TextInput onBlur={() => this.reverseAnimateInput()} onFocus={() => this.AnimateInput()} placeholder="phone number: 1-xxx-xxx-xxxx" style={styles.input} onChangeText={(value) => this.setState({phoneNumber: value})} />
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
                                    this.userSignUp();
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



