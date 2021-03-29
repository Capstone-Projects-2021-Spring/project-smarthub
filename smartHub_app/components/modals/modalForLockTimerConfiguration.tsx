import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, Platform, ScrollView, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button';
import axios from 'axios';
import { getAddressString } from '../../utils/utilities';

var screen = Dimensions.get('window');

//Need to create the interfaces to define the types for props and state variables
interface PropVariables{
    device_id: number
    lockTime: any
}

interface StateVariables{
    timerConfig: number
    selectedSeconds: number
}

const seconds = new Array(60).fill('').map((item, index)=>{
    return index;
})

const Item = ({text, isSelected, onPress}: any) => {
    return(
      <TouchableOpacity 
        onPress={onPress}
        style={[itemStyles.item, isSelected && itemStyles.itemIsSelected]}>
        <Text>{text}</Text>
      </TouchableOpacity>
    )
  }
  

export default class LockModal extends Component<PropVariables, StateVariables>{
    constructor(props: any){
        super(props);
        this.state = ({
            timerConfig: 0,
            selectedSeconds: 0,
        })
    }

    showModal = () => {
        this.refs.LockModal.open();
    }

    
    render(){
        return(
            <Modal
                ref={"LockModal"} 
                style={styles.modalStyling}
                position='center'
                backdrop={true}   
            >
            <ScrollView style={itemStyles.scroll}>
            {
                seconds.map((item, index)=>{
                return <Item 
                    onPress={ async ()=>{
                        await this.setState({selectedSeconds : item});
                        this.props.lockTime.getLockTime(this.state.selectedSeconds);
                        this.refs.LockModal.close();
                    }}
                    text={item} 
                    key={item} 
                    isSelected={this.state.selectedSeconds === index} 
                />
                })
            }
            </ScrollView>
                
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
        borderRadius: Platform.OS === 'ios' ? 30 : 30,
        shadowRadius: 10,
        width: screen.width - 80,
        height: 280
    }
})

const itemStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 300
    },
    row: {
      flex: 1,
    },
    scroll: {
      height: 300
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    item: {
      padding: 30,
      backgroundColor: '#474646',
      borderColor: 'white',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    itemIsSelected: {
      backgroundColor: 'gold'
    }
  });