import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, Platform} from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button';
import axios from 'axios';
import { getAddressString } from '../../utils/utilities';

var screen = Dimensions.get('window');

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    parentFlatList: any,
    profileList: any,
    user_id: number
}

interface StateVariables{
    newProfileName: string
}

export default class ProfileModal extends Component<PropVariables, StateVariables>{
    constructor(props: any){
        super(props);
        this.state = ({
            newProfileName: ''
        })
    }

    showModal = () => {
        this.refs.profileModal.open();
    }

    render(){
        return(
            <Modal
                ref={"profileModal"} 
                style={styles.modalStyling}
         
            >
                <Text style={{
                    fontSize: 21,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#fff',
                    position: 'absolute',
                    top: 0,
                    left:0,
                    right:0,
                    paddingTop:25
                }}>Create a new Profile: </Text>
                <TextInput
                    style={styles.textInputStyling}
                    onChangeText={(text) => this.setState({newProfileName : text})}
                    placeholder="Profile Name"
                    placeholderTextColor="#fff"
                    value={this.state.newProfileName}
                    />
                <Button
                    style={{ fontSize: 18, justifyContent: 'center', color: '#fff'}}
                    containerStyle={styles.buttonStyle}
                    onPress={() => {
                        //handles empty profile name
                        if(this.state.newProfileName.length === 0){
                            alert("You must enter a Profile Name first.");
                            return;
                        }
                        // console.log(this.props.profileList)
                        //handles duplicate profile name
                        if(this.props.profileList.some((item : any) => item.profile_name === this.state.newProfileName)){
                            alert(this.state.newProfileName + ' already exists.')
                            return;
                        }
                        
                        const newProfile = {
                            profileName: this.state.newProfileName,
                        }

                        let collection: any = {}
                        collection.user_id = this.props.user_id;
                        collection.profile_name = newProfile.profileName;
                        // console.warn(collection);

                        axios.post(getAddressString() + '/profiles/addProfile', collection).then((response) => {
                            //console.log(response.data)
                            //Push the item to the list and then refresh the list
                            //which would rerender the component
                            console.log("Profile " + newProfile.profileName + " successfully added.")
                            this.props.profileList.push(newProfile.profileName);
                            this.props.parentFlatList.getProfiles()
                            //Reset the state afterwards
                            this.setState({newProfileName : ""});
                        }, (error) => {
                            console.log("ERROR IN ADDING A PROFILE");
                            console.log(error);
                        })
                        this.refs.profileModal.close();
                    }}
                >Save</Button>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    
    buttonStyle: {
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0,
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 55,
        padding: 10,
        shadowRadius: 20,
        shadowColor: "#000",
        backgroundColor: '#E0A458'
    },

    textInputStyling: {
        borderBottomColor: '#E0A458',
        color: "#fff",
        marginLeft: 35,
        marginRight: 35, 
        marginBottom: 50,
        fontSize: 15,
        borderBottomWidth: 1,
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