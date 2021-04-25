import React, {Component} from 'react';
import {StyleSheet, Text, Dimensions, Platform, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modalbox';
import ImagePickerPage from '../pages/ImagePickerPage';

var screen = Dimensions.get('window');

//Need to create the interfaces to define the types for props and state variables
interface PropVariables{
    navigation: any,
    routeObject: any,
    parentFlatList: any
}

interface StateVariables{
    facialRecognition: string,
}

export default class FacialRecognitionModal extends Component<PropVariables, StateVariables>{
    constructor(props: any){
        super(props);
        this.state = ({
            facialRecognition: '',
        })
    }

    showModal = () => {
        this.refs.facialRecognitionModal.open(); 
    }

    render(){
      
        return(
            
            <Modal
                ref={"facialRecognitionModal"} 
                style={styles.modalStyling}
                position='center'
                backdrop={true}   
            >
                <Text style={{
                    fontSize: screen.width/20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingTop:25,
                    position: 'absolute',
                    top: 0,
                    left:0,
                    right:0,
                    color: "#fff"
                }}>Add a face to be recognized: </Text>
                <View style={{marginTop: 50, position: 'absolute', top:20, right:0, left:0}}>
                    <TouchableOpacity 
                        style={styles.buttonStyle}
                        onPress={() => ImagePickerPage(this, this.props.routeObject, this.props.parentFlatList)}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: screen.width/26, color: '#fff', paddingTop: 3}}>Upload from Camera Roll</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 65, position: 'absolute', top:70, right:0, left:0}}>
                    <TouchableOpacity 
                        style={styles.buttonStyle}
                        onPress={() => this.props.navigation.navigate('Image Capture Devices', this.props.routeObject)}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: screen.width/26, color: '#fff', paddingTop: 3}}>Take Photo</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    
    buttonStyle: {
        paddingTop: 5, 
        marginLeft: 50,
        marginRight: 90,
        marginBottom: 15,
        marginTop: 0,
        height: 40,
        width: screen.width/2,
        borderRadius: 6,
        backgroundColor: '#E0A458'

        // padding: 8,
        // marginLeft: 70,
        // marginRight: 90,
        // marginBottom: 30,
        // height: 40,
        // borderRadius: 6,
        // width: screen.width/2,
        // backgroundColor: '#E0A458'
    },

    modalStyling: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: screen.width - 90,
        height: screen.height/4,
        backgroundColor: '#1C1D2B',
        borderColor: '#E0A458',
        borderWidth: 2,
    }
})
