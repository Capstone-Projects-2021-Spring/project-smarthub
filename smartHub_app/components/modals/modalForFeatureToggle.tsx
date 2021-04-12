import React, { Component } from 'react';
import Modal from 'react-native-modalbox'
import {Switch, StyleSheet, Dimensions, Text, View} from 'react-native';
import CheckBox from 'react-native-check-box'
import Button from 'react-native-button';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputSpinner from "react-native-input-spinner";
import axios from 'axios';
var screen = Dimensions.get('window');

export default class FeatureModal extends Component<{feature: any, route: any},{number: number, isCheckedRecording: boolean, isCheckedAudio: boolean, isToggledFacial: boolean, isCheckedNotification: boolean,  isToggledMotion: boolean, wasSaved: boolean}>{
    constructor(props: any){
        super(props);
        this.state = ({
            isToggledFacial: false,
            isCheckedNotification: false,
            isCheckedRecording: false,
            isCheckedAudio: false,
            isToggledMotion: false,
            number: 5,
            wasSaved: false,
        })
    }

    showModal = () => {
        this.refs.featureModal.open(); 
    }

    getConfig = async() => {
        var collection = {
            device_id: this.props.route.device_id
        }
        console.log(this.props.route.device_id)
        var url = 'http://lukessmarthub.ddns.net:4000/devices/getConfig';
           await axios.post(url, collection).then((response: any) => {
               console.log(response.data)
               this.setState({isToggledFacial: response.data.device.device_config.type === "Facial" ? true : false,
               isToggledMotion: response.data.device.device_config.type === "Motion" ? true : false})
               this.setState({
                    isCheckedNotification:response.data.device.device_config.notifications,
                    isCheckedRecording: response.data.device.device_config.recording,
                    isCheckedAudio: response.data.device.device_config.audio,
                    number: 5,
                })
            }, (error) => {
                console.log(error);
            })
   }
   
   componentDidMount= () => {
     this.getConfig();
    }

    render(){
        return(
            <Modal
                ref={"featureModal"}
                onClosed= {async()=> {
                    if(this.state.wasSaved){
                        var deviceConfig = {
                            notifications: this.state.isCheckedNotification,
                            recording: this.state.isCheckedRecording,
                            recordingTime: this.state.number,
                            audio: this.state.isCheckedAudio,
                            type: !this.state.isToggledFacial && !this.state.isToggledMotion ? "None" :
                            this.state.isToggledFacial ? "Facial" : "Motion"
                        }
                        console.log(deviceConfig)
                        //below will be the call back given to the modal comp from the recording page
                        //this.props.feature.checkFeature(deviceConfig) 
                        // this.setState({
                        //     isToggledFacial: false,
                        //     isCheckedNotification: false,
                        //     isCheckedRecording: false,
                        //     isCheckedAudio: false,
                        //     isToggledMotion: false,
                        //     wasSaved: true,
                        //     number: 5,
                        // })
                    }
                }} 
                style={styles.modalStyling}
                position='center'
                backdrop={true}   
            >
                <Text style={{
                    fontSize: 22,
                    paddingTop:20,
                    color: "#fff",
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Choose a feature below: </Text>
                <View style={{flexDirection: "row", paddingLeft: 20, paddingTop: 20, paddingBottom: 20}}>
                    <Text style={{fontSize: 18, fontWeight: "bold", paddingTop: 5, color: "#fff", paddingLeft: 20, paddingRight: 30}}>Facial Recognition: </Text>    
                    <Switch
                        value={this.state.isToggledFacial}
                        onValueChange={(value) => {
                            if(this.state.isToggledMotion) this.setState({isToggledMotion:false})
                            this.setState({isToggledFacial: value, isCheckedNotification: false, isCheckedRecording: false, isCheckedAudio: false})}
                        }>
                    </Switch>
                </View>
                <View style={{flexDirection: "row", paddingLeft: 10, paddingBottom: 20}}>
                    <Text style={{fontSize: 18, fontWeight: "bold",  paddingLeft: 30, color: "#fff", paddingRight: 40}}>Motion Detection: </Text>    
                    <Switch
                        value={this.state.isToggledMotion}
                        onValueChange={(value) => {
                            if(this.state.isToggledFacial){this.setState({isToggledFacial: false})}
                            this.setState({isToggledMotion: value, isCheckedNotification: false, isCheckedRecording: false, isCheckedAudio: false})}
                        }>
                    </Switch>
                </View>
                <View style={{flex:1, flexDirection: "column", paddingTop: 0, marginTop: 0}}>
                    <View style={{flexDirection: "row", paddingLeft:25,  paddingBottom: 10, paddingTop: 0}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", paddingTop: 5, color: "#fff", paddingLeft: 15, paddingRight: 0}}>Enable Push Notifications? </Text>    
                        <CheckBox
                            onClick={() => {
                                if(!this.state.isToggledFacial && !this.state.isToggledMotion){
                                    alert("Please select an feature first.")
                                }else if(this.state.isCheckedNotification){
                                    this.setState({isCheckedNotification: false})
                                }else{
                                    this.setState({isCheckedNotification: true});
                                }
                            }}
                            isChecked={this.state.isCheckedNotification}
                            checkBoxColor = "green"
                            checkedCheckBoxColor = "green"
                            uncheckCheckBoxColor = "#222222"
                            style={{paddingTop: 3}}
                        />
                    </View>
                    <View style={{flexDirection: "row", paddingLeft:40, paddingBottom: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", paddingTop: 5, color: "#fff", paddingLeft: 0, paddingRight: 0}}>Would you like a recording taken? </Text>    
                        <CheckBox
                            onClick={() => {
                                if(!this.state.isToggledFacial && !this.state.isToggledMotion){
                                    alert("Please select a feature first.")
                                }else if(this.state.isCheckedRecording){
                                    this.setState({isCheckedRecording: false})
                                }else{
                                    this.setState({isCheckedRecording: true});
                                }
                            }}
                            isChecked={this.state.isCheckedRecording}
                            checkBoxColor = "green"
                            checkedCheckBoxColor = "green"
                            uncheckCheckBoxColor = "#222222"
                            style={{paddingTop: 3}}
                        />
                    </View>
                    {/* <View style={{ flexDirection: "row", paddingLeft:60, paddingBottom: 10}}>
                        <Text style={{fontSize: 14, fontWeight: "bold", paddingTop: 5, color: "#fff" , paddingRight: 0}}> - w/audio? </Text>    
                        <CheckBox
                            onClick={() => {
                                if(!this.state.isToggledFacial && !this.state.isToggledMotion){
                                    alert("Please select a feature first.")
                                }else if(!this.state.isCheckedRecording){
                                    alert("Recording must be checked!")
                                }else if(this.state.isCheckedAudio){
                                    this.setState({isCheckedAudio: false});
                                }else{
                                    this.setState({isCheckedAudio: true})
                                }
                            }}
                            isChecked={this.state.isCheckedAudio}
                            checkBoxColor = "green"
                            checkedCheckBoxColor = "green"
                            uncheckCheckBoxColor = "#222222"
                            style={{paddingTop: 3}}
                        />
                    </View> */}
                    <View style={{ flexDirection: "row", paddingLeft:60, paddingBottom: 30}}>
                        <Text style={{fontSize: 14, fontWeight: "bold", paddingTop: 5, color: "#fff" , paddingRight: 0}}> - Set recording length: </Text>    
                    </View>
                    <View style={{flex: 1,maxHeight: 30, justifyContent: 'center', alignItems: 'center'}}> 
                        <InputSpinner max={15} min={5}
                            value={this.state.number}
                            style={styles.spinner}
                            editable={false}
                            skin="modern"
                            height={30}           
                            onChange={(num: number) => {
                                this.setState({number: num});
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 45, marginTop: 20}}>
                    <Button
                        style={{paddingTop: 8, fontSize: 18, color: '#000'}}
                        containerStyle={styles.buttonStyle}
                        onPress={()=>{
                            this.setState({wasSaved: true}); 
                            this.refs.featureModal.close();}
                        }
                    >Save</Button>
                </View>
            </Modal>   
        )
    }
}

const styles = StyleSheet.create({
    
    modalStyling: {
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: "#222222",
        shadowRadius: 10,
        width: screen.width - 80,
        height: screen.height/2
    },
    buttonStyle: {
        marginLeft: 70,
        marginRight: 70,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#FF9900'
    },
    spinner: {
		flex: 1,	
        minWidth: 1	
	},
})
