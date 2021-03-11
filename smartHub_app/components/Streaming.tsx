import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast, {BaseToast} from 'react-native-toast-message'


export default class Streaming extends Component<{route: any, navigation: any}, {responseText: String}>{

    constructor(props: any){
        super(props);
        this.state= ({
            responseText: ""
        })
        this.beginStream = this.beginStream.bind(this);
        this.stopStream = this.stopStream.bind(this);
    }

    beginStream = () => {
        if(this.state.responseText!== 'Stream Starting.'){
            axios.get('http://100.19.94.49:4000/startStream').then((response) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Processing Request Please Wait...',
                        visibilityTime: 5000
                    })
                    setTimeout(() => {
                            this.setState({responseText: response.data})
                            Toast.show({
                                type: 'success',
                                text1: 'The Stream Is Live!',
                                text2: 'Press the play button to begin.',
                                visibilityTime: 2000
                            })
                        }
                    ,
                    5000);
            }, (error) => {
             console.log(error);
         })
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Stream Is Already Live!',
                text2: 'Click on the video player to view the stream.',
                visibilityTime: 2000
            })
        }
    }
    
    stopStream = () => {
        if(this.state.responseText !== 'Stream Closing'){
            axios.get('http://100.19.94.49:4000/stopStream').then((response) => {
                this.setState({responseText: response.data})
                console.log(response.data)
                Toast.show({
                    type: 'error',
                    text1: 'Stop Stream Clicked!',
                    text2: 'The stream is no longer live.',
                    visibilityTime: 2000
                });
            }, (error) => {
                console.log(error);
            })
        }else{
            Toast.show({
                type: 'success',
                text1: 'The Stream has already stopped!',
                visibilityTime: 2000
            })
        }
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.item.key
        })
    }

    render(){
        console.log(this.props.route.params.item.key)
        const toastConfig = {
            success: ({ text1, text2, ...rest } : any) => (
              <BaseToast
                {...rest}
                style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                  fontSize: 18,
                  fontWeight: 'bold'
                }}
                text2Style={{
                    color: "#000",
                    fontSize: 12
                }}
                text1={text1}
                text2={text2}
              />
            ),

            error: ({ text1, text2, ...rest } : any) => (
                <BaseToast
                  {...rest}
                  style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  text1Style={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                  text2Style={{
                      color: "#000",
                      fontSize: 10
                  }}
                  text1={text1}
                  text2={text2}
                />
              )
        }
        return(
        <View style={{flex:1, backgroundColor: "#222222"}}>
            <Toast style={{zIndex: 1}} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
               <WebView
                automaticallyAdjustContentInsets={false}
                style={{
                    flex: 1,
                }}
                originWhitelist={['*']}
                source={{html: '<iframe style="box-sizing: border-box; width: 100%; height: 99%; border: 15px solid #FF9900; background-color: #222222"; src="http://100.19.94.49:4000/watch.html" frameborder="0" allow="autoplay encrypted-media" allowfullscreen></iframe>'}} 
                mediaPlaybackRequiresUserAction={false}
                />
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 50, paddingBottom: 80}}>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.beginStream}>
                <Text style={{fontSize: 20}}>Begin Stream</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.pillButton}
                onPress={this.stopStream}>
                <Text style={{fontSize: 20}}>Stop Stream</Text>
            </TouchableOpacity>    
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create ({

    pillButton: {
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