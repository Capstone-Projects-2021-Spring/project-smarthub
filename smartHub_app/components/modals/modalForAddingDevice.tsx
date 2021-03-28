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
    DeviceModal: string
}

export default class DeviceModal extends Component<PropVariables, StateVariables>{
    constructor(props: any){
        super(props);
        this.state = ({
            DeviceName: '',
            DeviceIP: '',
            DeviceModal: ''
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
                }}>Add a new device: </Text>
                <TextInput
                    style={styles.textInputStyling}
                    onChangeText={(text) => this.setState({DeviceName : text})}
                    placeholder="Device Name"
                    value={this.state.DeviceName}
                    />
                <TextInput
                style={styles.textInputStyling}
                onChangeText={(text) => this.setState({DeviceIP : text})}
                placeholder="Device Domain Name"
                value={this.state.DeviceIP}
                />
                <Button
                    style={{ fontSize: 18, color: '#000'}}
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
                        if(this.props.deviceList.some((item : any) => item.DeviceName === this.state.DeviceName)){
                            alert(this.state.DeviceName+ ' already exists.')
                            return;
                        }
                        const DeviceName = {
                            DeviceName: this.state.DeviceName
                        }

                         let collection: any = {}
                        collection.user_email = this.props.routeObject.params.userEmail;
                        collection.profile_name = this.props.routeObject.params.item.profileName;
                        collection.device_address = this.state.DeviceIP;
                        collection.device_name = this.state.DeviceName;
                        collection.device_type = this.props.stackScreen;
                        // console.warn(collection);
                      
                       
                        axios.post(getAddressString() + '/profiles/addProfile', collection).then((response) => {
                            console.log(response.status)
                            //Push the item to the list and then refresh the list
                            //which would rerender the component
                            this.props.deviceList.push(DeviceName);
                            this.props.parentFlatList.refreshListInsert(this.state.DeviceName)
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
        backgroundColor: '#FF9900'
    },

    textInputStyling: {
        height: 40,
        borderBottomColor: 'gray',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1
    },

    modalStyling: {
        justifyContent: 'center',
        borderRadius: Platform.OS === 'ios' ? 30 : 0,
        shadowRadius: 10,
        width: screen.width - 80,
        height: 280
    }
})