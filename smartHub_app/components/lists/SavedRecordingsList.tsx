import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import axios from 'axios';
import {getAddressString} from '../../utils/utilities';
import RoundedDeviceListButton from '../buttons/RoundedDeviceListButton';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    navigation: any,
}

class SavedRecordingItem extends Component<PropVariables>{

    render(){
        return(
            <View style={{backgroundColor:"#151621"}}>
                <RoundedDeviceListButton onPress={() => this.props.navigation.navigate("Recorded Video Screen", this.props.item.url)} buttonText={this.props.item.key}></RoundedDeviceListButton>
            </View>
        );
    }
}

export class SavedRecordingsList extends Component<{navigation: any, routeObject: any}, {recordingsList: any, userEmail: ""}>{

    constructor(props: any){
        super(props);
        this.state = ({
            recordingsList: [],
            userEmail: ""
        });
        this.getRecordingsFromProfile = this.getRecordingsFromProfile.bind(this);
    }

    getUserInfo = async () => {
        let collection: any = {}
        collection.user_id = this.props.routeObject.item.user_id;
        await axios.post(getAddressString() + '/profiles/getUserInfo', collection).then((response) => {
            this.setState({userEmail: response.data.profiles[0].user_email});
        }, (error) => {
            console.log(error);
        })
    }

    getRecordingsFromProfile = async() => {
        await this.getUserInfo();
        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.props.routeObject.item.profile_name;
        collection.component_name = "Videos";

        //console.log(collection)
    
        await axios.post(getAddressString() + '/aws/get_key_list', collection).then((response) => {
            console.log("made it inside post");
            // console.log(response.data);
            this.setState({recordingsList: response.data.keyList});
            this.trimRecordingsList();
            //console.log(this.state.deviceList);
        }, (error) => {
            console.log("made it inside post error -- Saved Recordings");
            console.log(error);
        })
    }

    //Function to trim key names of files to get a short name (video date/time) to display on video button
    trimRecordingsList = () => {
        // console.log("TrimmingRecordingsNames");
        for(let i = 0; i < this.state.recordingsList.length; i++)
        {
            this.state.recordingsList[i].key = this.state.recordingsList[i].key.substring(this.state.recordingsList[i].key.lastIndexOf("/") + 1);
            this.state.recordingsList[i].key = this.state.recordingsList[i].key.substring(0, this.state.recordingsList[i].key.lastIndexOf("_GMT"));
        }
    }

    componentDidMount = () => {
        this.getRecordingsFromProfile()
    }

    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#151621", alignItems: 'center', paddingTop: 20}}>
                <FlatList
                    data={this.state.recordingsList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <SavedRecordingItem item={item} navigation={this.props.navigation}/>
                        );
                    }}
                />
            </View>
        );
    }
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
        backgroundColor: '#E0A458',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
    },

    ImageStyle: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: width-40,
        height: height
    }

})