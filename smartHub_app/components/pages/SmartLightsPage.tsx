import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'
import hexRgb from 'hex-rgb';
import Toast, {BaseToast} from 'react-native-toast-message';
import axios from 'axios';
import {getAddressString} from '../../utils/utilities';
import RoundedButton from '../buttons/RoundedButton';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

export default class SmartLight extends Component<{navigation: any, route: any},{deviceIP: string}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deviceIP: "",
        })
    }

    singleColor(obj: any){
        if(this.state.deviceIP !== "johnnyspi.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart light device.')
            return;
        }
        obj.randomize = false;
        obj.red = obj.red || 0;
        obj.green = obj.green || 0;
        obj.blue = obj.blue || 0;
        //console.log(obj);
        Toast.show({
            type: 'success',
            text1: 'Processing Please Wait...',
            visibilityTime: 5000
        })
        //console.log("http://"+ this.state.deviceIP + ":4000/lights")
        axios.post("http://"+ this.state.deviceIP + ":4000/lights", obj) .then((response) => {
            //console.log(response.data)
            Toast.show({
                type: 'success',
                text1: response.data,
                visibilityTime: 2000
            })
        }, (error) => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Could not configure light settings.',
                text2: 'Ensure your Pi is on and connected to the Smart Light Device.',
                visibilityTime: 2500
            })
        })
    }

    randomize(){
        if(this.state.deviceIP !== "johnnyspi.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart light device.')
            return;
        }
        let obj : any = {}
        obj.randomize = true;
        obj.red = Math.floor(Math.random()*256)
        obj.green = Math.floor(Math.random()*256)
        obj.blue = Math.floor(Math.random()*256)
        //console.log(obj);
        Toast.show({
            type: 'success',
            text1: 'Processing Please Wait...',
            visibilityTime: 5000
        })
        axios.post("http://"+ this.state.deviceIP + ":4000/lights", obj) .then((response) => {
            //console.log(response.data)
            //setTimeout(() => {
            Toast.show({
                type: 'success',
                text1: response.data,
                visibilityTime: 2000
            })
        }, (error) => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Could not configure light settings.',
                text2: 'Ensure your Pi is on and connected to the Smart Light Device.',
                visibilityTime: 2500
            })
        })
    }

    preset(themeType: string){
        if(this.state.deviceIP !== "johnnyspi.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart light device.')
            return;
        }
        let obj : any = {}
        obj.themeType = themeType;
        //console.log(obj);
        Toast.show({
            type: 'success',
            text1: 'Processing Please Wait...',
            visibilityTime: 2000
        })
        axios.post("http://"+ this.state.deviceIP + ":4000/lights", obj) .then((response) => {
            //console.log(response.data)
            Toast.show({
                type: 'success',
                text1: response.data,
                visibilityTime: 2000
            })
        }, (error) => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Could not configure light settings.',
                text2: 'Ensure your Pi is on and connected to the Smart Light Device.',
                visibilityTime: 2500
            })
        })
    }

    getDeviceIP = async () => {
        let collection: any = {}
        collection.device_id = this.props.route.params.device_id;
        await axios.post(getAddressString() + '/devices/getDeviceInfo', collection).then((response) => {
            //console.log(response.data);
            this.setState({deviceIP: response.data.device[0].device_address})
        }, (error) => {
            console.log(error);
        })
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: this.props.route.params.device_name,
        })
        this.getDeviceIP();
    }

    render(){
        const toastConfig = {
            success: ({ text1, text2, ...rest } : any) => (
              <BaseToast
                {...rest}
                style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                  fontSize: width/22,
                  fontWeight: 'bold'
                }}
                text2Style={{
                    color: "#000",
                    fontSize: width/25
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
                    fontSize:width/21,
                    fontWeight: 'bold'
                  }}
                  text2Style={{
                      color: "#000",
                      fontSize: width/26
                  }}
                  text1={text1}
                  text2={text2}
                />
              )
        }
        return(
            <View style={{flex:1, backgroundColor:'#151621', paddingTop: 20, alignItems: 'center'}}>
                <Toast style={{zIndex: 1}} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                <ColorPicker
                    onColorSelected={color => (this.singleColor(hexRgb(color)))}
                    hideSliders={false}
                    style={{width: width-60, height: height/2, paddingBottom: 20}}
                />
                <RoundedButton
                    onPress={()=>this.randomize()}
                    buttonText="Randomize">
                </RoundedButton>
                <RoundedButton
                    onPress={()=>this.preset('halloween')}
                    buttonText="Halloween Theme">
                </RoundedButton>
                <RoundedButton
                    onPress={()=>this.preset('christmas')}
                    buttonText="Christmas Theme">
                </RoundedButton>
                <RoundedButton
                    onPress={()=>this.singleColor({})}
                    buttonText="Off">
                </RoundedButton>
          </View>
        )
    }
}