import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import ProfileList from '../lists/ProfileList';

//This function creates the list of profiles that you see on the home page
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