import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import Streaming from './Streaming';
import Animated from 'react-native-reanimated'

var sampleData = [{key: "Web Cam x360"},{key: "Security Camera B121"}, {key: "Camera B1dd21"}, {key: "Security Camera B23121"}, {key: "Web Camera B121"}, {key: "Camera18 B121"}]

var width : number = Dimensions.get('window').width;

export function LiveStreamingDevices({ navigation } : {navigation: any}){
    return (
        <View style={{flex: 1, backgroundColor: "#222222"}}>
            <Text style={{paddingTop: 18, fontSize: 18, color: "#fff", fontWeight: 'bold', textAlign: 'center', paddingBottom: 20}}>Select the device you would like to stream from:</Text>
            <FlatList
                style={{flex:1}}
                data={sampleData}
                renderItem={({item, index} : any)=>{
                    return(
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                        <TouchableOpacity
                            style={styles.pillButton}
                            onPress={() => navigation.navigate('Live Stream', {item, navigation})}>
                            <Text style={{fontSize: 20}}>{item.key}</Text>
                        </TouchableOpacity>
                    </View>
                    );
                }}
            />
        </View>
    )
}

export function RecordingDevices(){
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

const styles = StyleSheet.create ({

    pillButton: {
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        margin: 5,
        width:width-20,
        height:50,        
        borderRadius:20,
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
    },

})