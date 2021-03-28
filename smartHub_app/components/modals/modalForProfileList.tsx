import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, Platform} from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button';

var screen = Dimensions.get('window');

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    parentFlatList: any,
    sampleList: any
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
                position='center'
                backdrop={true}   
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Create a new Profile: </Text>
                <TextInput
                    style={styles.textInputStyling}
                    onChangeText={(text) => this.setState({newProfileName : text})}
                    placeholder="Profile Name"
                    value={this.state.newProfileName}
                    />
                <Button
                    style={{ fontSize: 18, color: '#000'}}
                    containerStyle={styles.buttonStyle}
                    onPress={() => {
                        //handles empty profile name
                        if(this.state.newProfileName.length === 0){
                            alert("You must enter a Profile Name first.");
                            return;
                        }
                        //handles duplicate profile name
                        if(this.props.sampleList.some((item : any) => item.key === this.state.newProfileName)){
                            alert(this.state.newProfileName + ' already exists.')
                            return;
                        }
                        const newProfile = {
                            profileName: this.state.newProfileName,
                        }
                        //Push the item to the list and then refresh the list
                        //which would rerender the component
                        this.props.sampleList.push(newProfile);
                        console.log(this.props.sampleList)
                        this.props.parentFlatList.refreshList(this.state.newProfileName)
                        //Reset the state afterwards
                        this.setState({newProfileName : ""});
                        this.refs.profileModal.close();
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