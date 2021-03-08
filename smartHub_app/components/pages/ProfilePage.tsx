import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView} from 'react-native';

export default function ProfilePage({ navigation } : {navigation: any}){
    
    var width : number = Dimensions.get('window').width;
    var height : number = Dimensions.get('window').height;
    return(
        <View style={{flex: 1, backgroundColor: '#293241'}}>
             <View style={{justifyContent: 'center', width: width, height: height/3, borderWidth: 5,
            borderColor: '#FF1744'}}>
                <Text style={{textAlign: 'center', color: '#fff'}}>This is where we would grab the profile information into</Text>
            </View>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={() => navigation.navigate('Live Stream')}>
                <Image style={styles.imageStyle} source={{uri: 'https://i.pinimg.com/originals/c1/39/d3/c139d34d479a53a776f874cc718a3881.jpg'}}/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.roundButton}
                onPress={() => navigation.navigate('Record')}>
                <Image style={styles.imageStyle} source={{uri: 'https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Record-512.png'}}/>
            </TouchableOpacity>    
        </View>
        
    );
}

const styles = StyleSheet.create ({

    roundButton: {
        width: 75,
        height: 75,
        borderRadius: 100,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#EE6C4D',
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
    }
})