import React, { Component } from 'react';
import Modal from 'react-native-modalbox'
import {Switch, StyleSheet, Dimensions, Text, View} from 'react-native';
import CheckBox from 'react-native-check-box'
import Button from 'react-native-button';
import { TouchableOpacity } from 'react-native-gesture-handler';
var screen = Dimensions.get('window');

export default class FeatureModal extends Component<{feature: any},{isToggledFacial: boolean, isCheckedNotification: boolean,  isToggledMotion: boolean, wasSaved: boolean}>{
    constructor(props: any){
        super(props);
        this.state = ({
            isToggledFacial: false,
            isCheckedNotification: false,
            isToggledMotion: false,
            wasSaved: false,
        })
    }

    showModal = () => {
        this.refs.featureModal.open(); 
    }

    render(){
        return(
            <Modal
                ref={"featureModal"}
                onClosed= {()=> {
                    if(this.state.wasSaved){
                        var param1 = this.state.isToggledFacial ? "Facial" : "Motion";
                        var param2 = this.state.isCheckedNotification ? "YES" : "NO"
                        this.props.feature.checkFeature(param1, param2);  
                    }else{
                        this.setState({isCheckedNotification: false, isToggledFacial: false, isToggledMotion: false})
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
            <View style={{flex:1, flexDirection: "row", padding:40, paddingTop: 20, paddingBottom: 30}}>
            <Text style={{fontSize: 18, fontWeight: "bold", paddingTop: 5, color: "#fff", paddingLeft: 20, paddingRight: 30}}>Facial Recognition: </Text>    
            <Switch
                value={this.state.isToggledFacial}
                onValueChange={(value) => {
                    if(this.state.isToggledMotion) this.setState({isToggledMotion:false})
                    this.setState({isToggledFacial: value, isCheckedNotification: false})}
                }>
            </Switch>
            </View>
            <View style={{flex:1, flexDirection: "row", padding:30, paddingTop: 0}}>
            <Text style={{fontSize: 18, fontWeight: "bold",  paddingLeft: 30, color: "#fff", paddingRight: 40}}>Motion Detection: </Text>    
            <Switch
                value={this.state.isToggledMotion}
                onValueChange={(value) => {
                    if(this.state.isToggledFacial){this.setState({isToggledFacial: false})}
                    this.setState({isToggledMotion: value, isCheckedNotification: false})}
                }>
            </Switch>
            </View>
            <View style={{flex:1, flexDirection: "row", paddingLeft:40,}}>
            <Text style={{fontSize: 16, fontWeight: "bold", paddingTop: 5, color: "#fff", paddingLeft: 15, paddingRight: 0}}>Enable Push Notifications? </Text>    
            <CheckBox
                onClick={() => {
                    if(!this.state.isToggledFacial && !this.state.isToggledMotion){
                        alert("Please select an option first.")
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
            <View style={{flex: 1, marginBottom: 30, marginTop: 20}}>
            <Button
                style={{ paddingTop: 8, fontSize: 18, color: '#000'}}
                containerStyle={styles.buttonStyle}
                onPress={()=>{
                    if(!this.state.isToggledFacial && !this.state.isToggledMotion){
                        this.props.feature.checkFeature("No", "No");
                        this.refs.featureModal.close();
                    }else{
                        this.setState({wasSaved: true}); 
                        this.refs.featureModal.close();}}
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
        height: 280
    },
    buttonStyle: {
        marginLeft: 70,
        marginRight: 70,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#FF9900'
    },
})