import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView} from 'react-native';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

export default class ProfilePage extends Component<{navigation: any, routeObject: any}>{
    
    render(){
        return(
            <View style={styles.container}>
                <Text style={{marginTop: 50, fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>SmartHub Services:</Text>
                <View style={{paddingTop: 20, flexDirection: 'column', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Live Recording Devices', this.props.routeObject)}>
                    <Text style={{color: "#fff", textAlign: 'center', fontSize: 22}}>Recording</Text>
                    <Image style={styles.RecordImageStyle} source={{uri: 'https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Record-512.png'}}/>
                </TouchableOpacity> 
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Smart Light Devices', this.props.routeObject)}>
                    <Text style={{color: "#fff", textAlign: 'center', fontSize: 22}}>Smart Lights</Text>
                    <Image style={styles.LightImageStyle} source={{uri: 'https://cdn3.iconfinder.com/data/icons/smart-home-71/96/lightbulb_light_lighting_wireless_smartphone_control-512.png'}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Live Streaming Devices', this.props.routeObject)}>
                    <Text style={{color: "#fff", textAlign: 'center', fontSize: 22}}>Intercom</Text>
                    <Image style={styles.LightImageStyle} source={{uri: 'https://cdn3.iconfinder.com/data/icons/smart-home-71/96/lightbulb_light_lighting_wireless_smartphone_control-512.png'}}/>
                </TouchableOpacity>  
                </View>   
            </View>
        );
    }
}

const styles = StyleSheet.create ({

    container: {
        flex: 1,
        backgroundColor: '#222222'
    },

    button: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        width: width-20,
        margin: 10,
        borderWidth: 2,
        borderColor: "#ffa31a",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.00,
        elevation: 10,
    },

    RecordImageStyle: {
        width: 80,
        height: 80,
        position: 'absolute',
        left:0,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    LiveImageStyle: {
        width: 60,
        height: 60,
        position: 'absolute',
        left:0,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    LightImageStyle: {
        width: 60,
        height: 60,
        position: 'absolute',
        left:0,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    }
})