import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'

export function LiveStream(){
    return (
        <WebView
         source={{html: '<iframe width="500%" height="100%" src="http://100.19.94.49:4000/" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'}} 
        />
    );
}

export function Record(){
    return (
        <View>
            <Text>Need to implement record functionality here</Text>
        </View>
    );

}

export function SavedRecordings(){
    return (
        <View>
            <Text>Need to grab all recordings from s3 and place them here</Text>
        </View>
    );
}

export function SavedImages(){
    return (
        <View>
            <Text>Need to grab all images taken by user here</Text>
        </View>
    );
}