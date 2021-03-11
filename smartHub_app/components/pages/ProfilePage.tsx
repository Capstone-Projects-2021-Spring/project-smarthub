import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView} from 'react-native';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//The TouchableOpacity is what creates the buttons, this is hard coded but will 
//be changed in future implementations.
export default function ProfilePage({ navigation } : {navigation: any}){
    
    return(
        <View style={styles.container}>
             <View style={styles.welcomeView}>
                <Text style={{textAlign: 'center', color: '#fff'}}>This is where we would grab the profile information into</Text>
            </View>
            <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={() => navigation.navigate('Live Streaming Devices')}>
                <Image style={styles.imageStyle} source={{uri: 'https://i.pinimg.com/originals/c1/39/d3/c139d34d479a53a776f874cc718a3881.jpg'}}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={() => navigation.navigate('Record')}>
                <Image style={styles.imageStyle} source={{uri: 'https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Record-512.png'}}/>
            </TouchableOpacity> 
            </View>   
        </View>
        
    );
}

const styles = StyleSheet.create ({

    container: {
        flex: 1,
        backgroundColor: '#222222'
    },

    roundButton: {
        width: 75,
        height: 75,
        borderRadius: 100,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
    },

    imageStyle: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 100
    },

    welcomeView: {
        justifyContent: 'center', 
        width: width, 
        height: height/4, 
        borderWidth: 5,
        borderColor: '#FF1744'
    }
})