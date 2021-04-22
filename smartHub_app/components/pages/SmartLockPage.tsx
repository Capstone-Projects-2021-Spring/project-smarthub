import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'
import hexRgb from 'hex-rgb';
import Toast, {BaseToast} from 'react-native-toast-message';
import axios from 'axios';
import {getAddressString} from '../../utils/utilities';
import LockModal from '../modals/modalForLockTimerConfiguration';
import RoundedButton from '../buttons/RoundedButton';
import InputSpinner from 'react-native-input-spinner';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

export default class SmartLock extends Component<{navigation: any, route: any},{deviceIP: string, device_id: number, selectedSeconds: number}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deviceIP: "",
            device_id: this.props.route.params.device_id,
            selectedSeconds: 0,
            // lockFunction: this.unlock,
            // lockText: "Unlock",
        });
        // this.launchModal = this.launchModal.bind(this);

        
    }

    // launchModal = () => {
    //     this.refs.LockModal.showModal();
    // }

    // getLockTime = (seconds: any) => {
    //     this.setState({selectedSeconds: seconds});
    //  }
  


    lock = () => {
        if(this.state.deviceIP !== "lukessmarthub.ddns.net"){
            alert(this.props.route.params.device_name + ' not compatible as a smart lock device.')
            return;
        }

        axios.post('http://' + this.state.deviceIP + ':4000/lock/lock').then((response) => {
            console.log(response.data);
            // this.setState({lockFunction: this.unlock, lockText:"Unlock"});
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
        // console.log(this.state.lockText);
        return(
            <View style={{flex:1, backgroundColor: '#151621', paddingTop: 20, alignItems: 'center'}}>
                
                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={this.lock}>
                    <Text style={styles.text}>Lock</Text>
                </TouchableOpacity> */}
                <RoundedButton
                    
                    onPress={this.unlock}
                    buttonText={"Unlock"}
                >
                    {/* <Text style={styles.text}>Unlock</Text> */}
                </RoundedButton>

                <RoundedButton
                    
                    onPress={this.lock}
                    buttonText={"Lock"}
                >
                    {/* <Text style={styles.text}>Unlock</Text> */}
                </RoundedButton>
                {/* <RoundedButton
                    
                    onPress={this.launchModal}
                    buttonText="Set Time"
                /> */}
                    

                    <View style={{ flexDirection: "row", paddingBottom: 25}}>
                        <Text style={{fontSize: 14, fontWeight: "bold", paddingTop: 5, color: "#fff" , paddingRight: 0}}>Set Time</Text>    
                    </View>
                    <View style={{flex: 1,maxHeight: 30,  justifyContent: 'center', alignItems: 'center'}}> 
                    {/* max={15} min={5} */}
                        <InputSpinner 
                            value={this.state.selectedSeconds}
                            style={styles.spinner}
                            editable={false}
                            skin="modern"
                            height={30}           
                            onChange={(num: number) => {
                                this.setState({selectedSeconds: num});
                            }}
                        />
                    </View>
               
                {/* <CustomButton buttonText="Record">

                </CustomButton> */}
                
                <LockModal ref={'LockModal'} lockTime={this} device_id={this.state.device_id}/>
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