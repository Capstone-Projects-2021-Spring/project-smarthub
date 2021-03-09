import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'

export default class Streaming extends Component{

    constructor(props: any){
        super(props);
        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);
        this.test = this.test.bind(this);
    }

    test = () => {
        console.log("test")
    }

    beginStream = () => {
        axios.get('http://100.19.94.49:4000/startStream').then((response) => {
            console.log(response.status)
        }, (error) => {
            console.log(error);
        })
    }
    
    stopStream = () => {
        axios.get('http://100.19.94.49:4000/stopStream').then((response) => {
            console.log(response.status)
        }, (error) => {
            console.log(error);
        })
    }

    render(){
        return(
        <View style={{flex:1}}>
            <Text style={{paddingTop: 10, fontWeight: "bold", textAlign: 'center', fontSize: 16}}>Select the device you would like to stream from.</Text>
            <View style={{flex:1, flexDirection: 'column',padding: 10, borderColor: '#000',}}>
                <WebView
                onPress={this.test}
                source={{html: '<iframe sandbox="allow-scripts" style="box-sizing: border-box; width: 100%; height: 50%; border: 15px solid #FF9900"; src="https://www.youtube.com/embed/tgbNymZ7vqY" frameborder="0" encrypted-media"></iframe>'}} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 30}}>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={this.beginStream}>
                <Text style={{fontSize: 20}}>Begin Stream</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={this.stopStream}>
                <Text style={{fontSize: 20}}>Stop Stream</Text>
            </TouchableOpacity>    
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create ({

    roundButton: {
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        margin: 5,
        width:175,
        height:50,        
        borderRadius:20,
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
    },

})