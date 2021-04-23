import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'
import hexRgb from 'hex-rgb';
import Toast, {BaseToast} from 'react-native-toast-message';
import axios from 'axios';
import {getAddressString} from '../../utils/utilities';
import RoundedButton from '../buttons/RoundedButton';
import InputSpinner from 'react-native-input-spinner';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

export default class SmartLock extends Component<{navigation: any, route: any},{deviceIP: string, device_id: number, selectedSeconds: number, lockImage: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deviceIP: "",
            device_id: this.props.route.params.device_id,
            selectedSeconds: 0,
            lockImage: require('../../assets/lock-locked.png'),
            // lockFunction: this.unlock,
            // lockText: "Unlock",
        });        
    }
  


    lock = () => {
        if(this.state.deviceIP !== "lukessmarthub.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart lock device.')
            return;
        }

        axios.post('http://' + this.state.deviceIP + ':4000/lock/lock').then((response) => {
            console.log(response.data);
            // this.setState({lockFunction: this.unlock, lockText:"Unlock"});
            this.setState({lockImage: require('../../assets/lock-locked.png')});
        }, (error) => {
            console.log(error);
        })
    }

    unlock = () => {
        if(this.state.deviceIP !== "lukessmarthub.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart lock device.')
            return;
        }

        let collection: any = {}
        collection.lockTimeout = this.state.selectedSeconds;
        console.log(collection);
        axios.post('http://' + this.state.deviceIP + ':4000/lock/unlock', collection).then((response) => {
            console.log(response.data);
            // this.setState({lockFunction: this.lock, lockText:"Lock"});
            this.setState({lockImage: require('../../assets/lock-unlocked.png')});
            if(this.state.selectedSeconds != 0)
            {
                setTimeout(() => {this.setState({lockImage: require('../../assets/lock-locked.png')});}, this.state.selectedSeconds*1000);
            }
        }, (error) => {
            console.log(error);
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
        return(
            <View style={{flex:1, backgroundColor: '#151621', paddingTop: 20, alignItems: 'center'}}>
                {/* <Image style={{flex: 1, resizeMode: 'contain', marginLeft: 140}} source={require("../../assets/video-cam-icon.png")} /> */}
                <View style={{width: '35%', height: '40%'}}>
                <Image style={{flex: 1, resizeMode: 'contain',  alignContent: 'center'}} source={this.state.lockImage}/>
                </View>
                <RoundedButton
                    
                    onPress={this.unlock}
                    buttonText={"Unlock"}
                >
                </RoundedButton>

                <RoundedButton
                    
                    onPress={this.lock}
                    buttonText={"Lock"}
                >
                </RoundedButton>
                    

                    <View style={{ flexDirection: "row", paddingBottom: 25, marginTop: 40}}>
                        <Text style={{textAlign: "center", fontSize: 20, paddingTop: 5, color: "#fff" , paddingRight: 0}}>Set Time</Text>    
                    </View>
                    <View style={{flex: 1,maxHeight: 30,  justifyContent: 'center', alignItems: 'center'}}> 
                    {/* max={15} min={5} */}
                        <InputSpinner 
                            value={this.state.selectedSeconds}
                            style={styles.spinner}
                            editable={false}
                            skin="modern"
                            height={40}           
                            onChange={(num: number) => {
                                this.setState({selectedSeconds: num});
                            }}
                        />
                    </View>
          </View>
          
        )
    }
}

const styles = StyleSheet.create({    
    spinner: {
		flex: 1,	
        minWidth: 1,	
        marginBottom: 10
	},
})