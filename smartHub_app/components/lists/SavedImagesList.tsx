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

class SavedImageItem extends Component<PropVariables>{

    render(){
        console.log(this.props.item)
        return(
            <View style={{backgroundColor:"#151621"}}>
                <RoundedDeviceListButton onPress={() => this.props.navigation.navigate("Image Screen", this.props.item.url)} buttonText={this.props.item.key}></RoundedDeviceListButton>
            </View>
        );
    }
}

export class SavedImagesList extends Component<{navigation: any, routeObject: any}, {imageList: any, userEmail: String}>{

    constructor(props: any){
        super(props);
        this.state = ({
            userEmail: "",
            imageList: []
        });
        this.getImagesFromProfile = this.getImagesFromProfile.bind(this);
    }
    
    componentDidMount = () => {
        this.getImagesFromProfile()
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

    getImagesFromProfile = async() => {
        await this.getUserInfo();
        let collection: any = {}
        collection.user_email = this.state.userEmail;
        collection.profile_name = this.props.routeObject.item.profile_name;
        collection.component_name = "Images";
        console.log(collection);
        
        await axios.post(getAddressString() + '/aws/get_key_list', collection).then(async (response) => {
            console.log("made it inside post");
            console.log(response.data);
            this.setState({imageList: response.data.keyList});
            await this.trimRecordingsList();
            //console.log(this.state.imageList);
        }, (error) => {
            console.log("made it inside post error -- Image List");
            console.log(error);
        })
    }

    trimRecordingsList = () => {
        // console.log("TrimmingRecordingsNames");
        for(let i = 0; i < this.state.imageList.length; i++)
        {
            this.state.imageList[i].key = this.state.imageList[i].key.substring(this.state.imageList[i].key.lastIndexOf("/") + 1);
            this.state.imageList[i].key = this.state.imageList[i].key.substring(0, this.state.imageList[i].key.lastIndexOf("_GMT"));
        }
    }

    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#151621", alignItems: 'center', paddingTop: 20}}>
                <FlatList
                    data={this.state.imageList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <SavedImageItem item={item} navigation={this.props.navigation}/>
                        );
                    }}
                />
            </View>
        );
    }
}