import React, {Component} from 'react';
import {Text, TextInput, Dimensions, Platform} from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button';

var screen = Dimensions.get('window');

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
                style={{
                    justifyContent: 'center',
                    borderRadius: Platform.OS === 'ios' ? 30 : 0,
                    shadowRadius: 10,
                    width: screen.width - 80,
                    height: 280
                }}
                position='center'
                backdrop={true}
                
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Create a new Profile: </Text>
                <TextInput
                    style={{
                        height: 40,
                        borderBottomColor: 'gray',
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 20,
                        marginBottom: 10,
                        borderBottomWidth: 1
                    }}
                    onChangeText={(text) => this.setState({newProfileName : text})}
                    placeholder="Profile Name"
                    value={this.state.newProfileName}
                    />
                <Button
                    style={{ fontSize: 18, color: 'white'}}
                    containerStyle={{
                        padding: 8,
                        marginTop: 10,
                        marginLeft: 70,
                        marginRight: 70,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: 'mediumseagreen'
                    }}
                    onPress={() => {
                        if(this.state.newProfileName.length === 0){
                            alert("You must enter a Profile Name first.");
                            return;
                        }
                        //need to handle duplicate profile names still

                        const newProfile = {
                            key: this.state.newProfileName,
                        }
                        this.props.sampleList.push(newProfile);
                        //console.log(this.props.sampleList)
                        this.props.parentFlatList.refreshList(this.state.newProfileName)
                        this.setState({newProfileName : ""});
                        this.refs.profileModal.close();
                    }}
                >Save</Button>
            </Modal>
        );
    }
}