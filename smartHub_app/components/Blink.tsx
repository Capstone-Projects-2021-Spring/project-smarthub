import React, {Component} from 'react';
import {Animated, View, Text} from 'react-native';

export default class Blink extends Component{
    fadeAnimation: Animated.Value;
    constructor(props: any){
        super(props);
        this.fadeAnimation = new Animated.Value(0);
    }

    componentDidMount(){
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.fadeAnimation, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(this.fadeAnimation, {
                    toValue: 1,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }

    stopBlinking(){
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.fadeAnimation, {
                    toValue: 0,
                    useNativeDriver: true,
                })
            ])
        ).stop();
    }

    render(){
        return(
            <View>
                <Animated.View style={{opacity: this.fadeAnimation}}>
                <View style={{flex:1,  width: 20,
                    height: 20,
                    borderRadius: 10,
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'red',}}>
                </View>
                </Animated.View>
            </View>
        )
    }
}