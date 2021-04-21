import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, Platform} from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button';
import axios from 'axios'
import { getAddressString } from '../../utils/utilities';

var screen = Dimensions.get('window');

//Need to create the interfaces to define the types for props and state variables
interface PropVariables{
    parentFlatList: any,
    deviceList: any,
    routeObject: any,
    stackScreen: string
}

interface StateVariables{
    DeviceIP: string,
    DeviceName: string,
}

export default class DeviceModal extends Component<PropVariables, StateVariables>{
    constructor(props: any){
        super(props);
        this.state = ({
            DeviceName: '',
            DeviceIP: '',
        })
    }

    showModal = () => {
        this.refs.deviceModal.open(); 
    }

    render(){
        //console.log(this.props.routeObject.params.userEmail)
        //console.log(this.props.stackScreen)
        return(
            <Modal
                ref={"deviceModal"} 
                style={styles.modalStyling}
                position='center'
                backdrop={true}   
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: "#fff"
                }}>Add a new device: </Text>
                <TextInput
                    style={styles.textInputStyling}
                    onChangeText={(text) => this.setState({DeviceName : text})}
                    placeholder="Device Name"
                    placeholderTextColor="#fff"
                    value={this.state.DeviceName}
                    />
                <TextInput
                style={styles.textInputStyling}
                onChangeText={(text) => this.setState({DeviceIP : text})}
                placeholder="Device Domain Name"
                placeholderTextColor="#fff"
                value={this.state.DeviceIP}
                />
                <Button
                    style={{ fontSize: 18, color: '#fff'}}
                    containerStyle={styles.buttonStyle}
                    onPress={() => {
                        //handles empty device name
                        if(this.state.DeviceName.length === 0){
                            alert("You must enter a Device Name.");
                            return;
                        }
                        //handles empty ip address
                        if(this.state.DeviceIP.length === 0){
                            alert("You must enter a Device Domain Name.");
                            return;
                        }
                        //handles duplicate device name
                        if(this.props.deviceList.some((item : any) => item.device_name === this.state.DeviceName)){
                            alert(this.state.DeviceName+ ' already exists.')
                            return;
                        }
                        const newDevice = {
                            DeviceName: this.state.DeviceName
                        }
                         let collection: any = {}
                        collection.profile_id = this.props.routeObject.params.item.profile_id;
                        collection.device_address = this.state.DeviceIP;
                        collection.device_name = this.state.DeviceName;
                        collection.device_type = this.props.stackScreen === 'Take Photo' ? 'Recording Devices' : this.props.stackScreen;
                        console.log(this.props.stackScreen)
                        // console.warn(collection);
                      
                        axios.post(getAddressString() + '/devices/addDevice', collection).then((response) => {
                            //console.log(response.status)
                            //Push the item to the list and then refresh the list
                            //which would rerender the component
                            console.log("Device " + newDevice.DeviceName + " successfully added.");
                            this.props.deviceList.push(newDevice.DeviceName);
                            this.props.parentFlatList.getDevices()
                            //Reset the state afterwards
                            this.setState({DeviceName : "", DeviceIP: ""});
                        }, (error) => {
                            console.log(error);
                        })

                        this.refs.deviceModal.close();
                    }}
                >Save</Button>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    
    buttonStyle: {
        padding: 8,
        marginTop: 10,
        marginLeft: 70,
        marginRight: 70,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#E0A458'
    },

    textInputStyling: {
        height: 40,
        borderBottomColor: '#E0A458',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        color: "#fff"
    },

    modalStyling: {
        justifyContent: 'center',
        shadowRadius: 10,
        width: screen.width - 60,
        height: screen.height/2.2,
        backgroundColor: '#1C1D2B',
        borderColor: '#E0A458',
        borderWidth: 2,
    }
})