import React from 'react';
import {StyleSheet, View} from 'react-native';
import ProfileList from '../lists/ProfileList';

export default function HomePage({ navigation } : {navigation: any}){
    return (
        <View style={styles.container}>
           <ProfileList navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})