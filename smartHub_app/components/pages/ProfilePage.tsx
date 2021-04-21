import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView} from 'react-native';
import RoundedListImageButton from '../buttons/RoundedListImageButton';

var width : number = Dimensions.get('window').width;

export default class ProfilePage extends Component<{navigation: any, routeObject: any}>{
    
    render(){
        return(
            <View style={styles.container}>
                <Text style={{marginTop: 50, fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>SmartHub Services:</Text>
                <View style={{paddingTop: 20, flexDirection: 'column', justifyContent: 'center'}}>
                <RoundedListImageButton
                    onPress={() => this.props.navigation.navigate('Live Recording Devices', this.props.routeObject)}
                    buttonText="Recording"
                    imageLink='https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Record-512.png'>
                </RoundedListImageButton> 
                <RoundedListImageButton
                    onPress={() => this.props.navigation.navigate('Smart Light Devices', this.props.routeObject)}
                    buttonText="Smart Lights"
                    imageLink='https://cdn3.iconfinder.com/data/icons/smart-home-71/96/lightbulb_light_lighting_wireless_smartphone_control-512.png'>
                </RoundedListImageButton>
                <RoundedListImageButton
                    onPress={() => this.props.navigation.navigate('Smart Lock Devices', this.props.routeObject)}
                    buttonText="Smart Lock"
                    imageLink='https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-256.png'>
                </RoundedListImageButton>
                <RoundedListImageButton
                    onPress={() => this.props.navigation.navigate('Live Intercom Devices', this.props.routeObject)}
                    buttonText="Intercom"
                    imageLink='https://cdn3.iconfinder.com/data/icons/smart-home-71/96/lightbulb_light_lighting_wireless_smartphone_control-512.png'>
                </RoundedListImageButton>  
                </View>   
            </View>
        );
    }
}

const styles = StyleSheet.create ({

    container: {
        flex: 1,
        backgroundColor: '#151621',
    },
})