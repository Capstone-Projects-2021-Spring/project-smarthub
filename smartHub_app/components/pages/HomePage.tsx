import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import ProfileList from '../lists/ProfileList';

//This function creates the list of profiles that you see on the home page
export default class HomePage extends Component<{route: any, navigation: any}>{
    
    render(){
        return (
            <View style={styles.container}>
            <ProfileList navigation={this.props.navigation} userEmail={this.props.route.params} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})