import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import axios from 'axios';
import {Icon} from 'native-base'
import {getAddressString} from '../../utils/utilities';
import FacialRecognitionModal from '../modals/modalForFacialRecognition';
import { DrawerActions } from '@react-navigation/native';

var sampleList = [{key: "Johnny"},{key: "Paul"}]

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    navigation: any,
}

class SavedFRItem extends Component<PropVariables>{

    render(){
        //console.log(this.props.item)
        return(
            <View style={{backgroundColor:"#222222"}}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => this.props.navigation.navigate("Image Screen", this.props.item.url)}>
                    <Text style={{color: '#000', fontSize: 20}}>{this.props.item.key}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export class SavedFacialRecognitions extends Component<{navigation: any, routeObject: any}, {facialRecognitionsList: any, userEmail: String}>{

    constructor(props: any){
        super(props);
        this.state = ({
            userEmail: "",
            facialRecognitionsList: []
        });
        this.getImagesFromProfile = this.getImagesFromProfile.bind(this);
    }

    launchModal = () => {
        this.refs.facialRecognitionModal.showModal();
    }
    
    componentDidMount = () => {
        //console.log(this.props.route)
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
        
        // await axios.post(getAddressString() + '/aws/get_key_list', collection).then(async (response) => {
        //     console.log("made it inside post");
        //     console.log(response.data);
        //     this.setState({facialRecognitionsList: response.data.keyList});
        //     await this.trimRecordingsList();
        //     //console.log(this.state.facialRecognitionsList);
        // }, (error) => {
        //     console.log("made it inside post error -- Image List");
        //     console.log(error);
        // })
    }

    trimRecordingsList = () => {
        // console.log("TrimmingRecordingsNames");
        for(let i = 0; i < this.state.facialRecognitionsList.length; i++)
        {
            this.state.facialRecognitionsList[i].key = this.state.facialRecognitionsList[i].key.substring(this.state.facialRecognitionsList[i].key.lastIndexOf("/") + 1);
            this.state.facialRecognitionsList[i].key = this.state.facialRecognitionsList[i].key.substring(0, this.state.facialRecognitionsList[i].key.lastIndexOf("_GMT"));
        }
    }

    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#222222", alignItems: 'center', paddingTop: 20}}>
                <TouchableOpacity
                    style={styles.pillButtonNew}
                    onPress={this.launchModal}>
                    <Icon name="ios-add" />
                </TouchableOpacity>           
                <FlatList
                    data={sampleList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <SavedFRItem item={item} navigation={this.props.navigation}/>
                        );
                    }}
                />
                <FacialRecognitionModal ref={'facialRecognitionModal'} routeObject={this.props.routeObject} navigation={this.props.navigation} parentFlatList={this} facialRecognitionsList={this.state.facialRecognitionsList} />
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
        backgroundColor: '#FF9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
    },

    pillButtonNew: {
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        margin: 5,
        width:width-20,
        height:50,        
        borderRadius:20,
        backgroundColor: 'lightgray',
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