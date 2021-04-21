  
import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Alert, Dimensions, Image, ImageBackground} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base'
import ProfileModal from '../modals/modalForProfileList';
import { BackHandler } from 'react-native';
import axios from 'axios';
import {getAddressString} from '../../utils/utilities';
import SquareButton from '../buttons/RoundedListButton';
import RoundedListButton from '../buttons/RoundedListButton';


var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    index: any,
    parentFlatList: any,
    navigation: any,
    profileList: any
}

interface StateVariables{
    activeRowKey : any
}

//This class is for each "individual item" in the Profile List (the ProfileList class is below this one)
class ProfileListItem extends Component<PropVariables,StateVariables>{
    constructor(props: any){
        super(props);
        this.state= ({
            activeRowKey: null
        });
    }
    render(){
        let item = this.props.item;
        const swipeSettings = {
            autoClose: true,
            onClose: () => {
                if(this.state.activeRowKey != null){
                    this.setState({activeRowKey : null});
                }
            },
            onOpen: () => {
                this.setState({activeRowKey: this.props.index})
            },
            right: [
                {
                    onPress: () => {
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ' + item.profile_name + '?',
                            [
                                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Yes', onPress: () => {
                                    // this.props.deviceList.splice(this.props.index, 1);
                                     //Refresh list
                                     
                                     let collection: any = {}
                                     collection.profile_id = item.profile_id;
                                     // console.warn(collection);
                                     
                                    axios.post(getAddressString() + '/profiles/deleteProfile', collection).then((response) => {
                                        console.log("Profile " + item.profile_name + " successfully deleted.");
                                         //splice the item to the list and then refresh the list
                                         //which would rerender the component
                                         this.props.profileList.splice(this.props.index, 1);
                                         this.props.parentFlatList.getProfiles();
                                     }, ({error, response}) => {
                                        console.log("ERROR IN DELETING A PROFILE");
                                         console.log(response.data.message);
                                     })
                                    
                                    
                                 }},
                             ],
                            {cancelable: true}
                        )
                    },
                        text: 'Delete', type: 'delete'
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };
        return(
            <Swipeout {...swipeSettings} style={{backgroundColor:'#151621'}}  >
                <RoundedListButton onPress={() => this.props.navigation.navigate('Profile', {item})} buttonText={item.profile_name}></RoundedListButton>
            </Swipeout>
        );
    }
}

//Creates the list of profiles that are present on the home page
export default class ProfileList extends Component<{navigation: any, user_id: number}, {profileList: any, checkData: boolean}>{

    constructor(props : any){
        super(props);
        this.state = ({
            profileList: [],
            checkData: false
        });
        this.launchModal = this.launchModal.bind(this);
        this.getProfiles = this.getProfiles.bind(this);
    }

    getProfiles = async() => {
        let collection: any = {}
        collection.user_id = this.props.user_id;
        //console.log(collection);
        await axios.post(getAddressString() + '/profiles/getProfiles', collection).then((response) => {
            //console.log(response.data.profiles.length)
            this.setState({checkData: false, profileList: response.data.profiles});
        }, (error) => {
            this.setState({checkData: true});
        })
    }

    launchModal = () => {
        this.refs.profileModal.showModal();
    }

    componentDidMount = async () => {
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={this.launchModal}>
                <Icon name="ios-add" />
                </TouchableOpacity>  
            ),
            headerLeft: () => (
                <TouchableOpacity
                style={{marginLeft: 18, marginBottom: 1.5, marginTop: 5}}
                onPress={() => this.props.navigation.navigate('Sign In')}>
                <Icon name="exit" />
                </TouchableOpacity>  
            ),
                
        })
        this.getProfiles();
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        return true;
    };

    render(){
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.profileList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <ProfileListItem item={item} index={index} parentFlatList={this} profileList={this.state.profileList} navigation={this.props.navigation}></ProfileListItem>
                        );
                    }}
                    keyExtractor={item => item.profile_id.toString()}
                    ListEmptyComponent={() => {
                        if(this.state.checkData){
                            return(
                                <View style={{marginTop: height/7, flex: 1, alignItems: 'center', height: height/2, justifyContent: 'center'}}>
                                    <Text style={{paddingTop: 18, fontSize: width/21, color: "#fff", fontWeight: 'bold'}}>Looks like you haven't added any Profiles.</Text>
                                    <Text style={{paddingTop: 18, fontSize: width/24, color: "#fff", fontWeight: 'bold', paddingBottom: 20}}>Click the "+" on the top right to add a new Profile.</Text>
                                    <Image resizeMode={'contain'} style={styles.ImageStyle} source={{uri: 'https://image.flaticon.com/icons/png/512/122/122935.png'}}/>
                                </View>
                            )
                        }else{
                            return null;
                        }
                        
                    }}
                />
                <ProfileModal ref={'profileModal'} parentFlatList={this} user_id={this.props.user_id} profileList={this.state.profileList} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151621',
    },

    itemText: {
        color: '#fff',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 40
    },

    welcomeView: {
        justifyContent: 'center', 
        width: width, 
        height: height/4, 
        borderWidth: 4,
        borderColor: "lightgray",
    },

    ImageStyle: {
        width: "100%",
        height: "76%"
    }
})