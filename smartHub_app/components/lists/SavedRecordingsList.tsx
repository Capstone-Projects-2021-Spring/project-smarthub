import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base';
import axios from 'axios';
import DeviceModal from '../modals/modalForAddingDevice';
import {getAddressString} from '../../utils/utilities';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;


//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    index: any,
    parentFlatList: any,
    navigation: any,
    stackScreen: string,
    deviceList : any,
    routeObject: any
}

interface StateVariables{
    activeRowKey : any,
}

//This class is for each "individual item" in the Profile List (the ProfileList class is below this one)
class SavedRecordingItem extends Component<PropVariables,StateVariables>{
    constructor(props: any){
        super(props);
        this.state= ({
            activeRowKey: null,
        });
    }

    render(){
        // let routeObject = {
        //     device_name: this.props.item.device_name,
        //     userEmail: this.props.routeObject.userEmail,
        //     profileName: this.props.routeObject.item.profileName,
        //     device_type: this.props.stackScreen
        // }
        // console.log(this.props.routeObject);
        // const swipeSettings = {
        //     autoClose: true,
        //     onClose: () => {
        //         if(this.state.activeRowKey != null){
        //             this.setState({activeRowKey : null});
        //         }
        //     },
        //     onOpen: () => {
        //         this.setState({activeRowKey: this.props.index})
        //     },
        //     right: [
        //         {
        //             onPress: () => {
        //                 const rowToDelete = this.state.activeRowKey;
        //                 Alert.alert(
        //                     'Alert',
        //                     'Are you sure you want to delete this profile?',
        //                     [
        //                         {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //                         {text: 'Yes', onPress:  () => {
        //                             // this.props.deviceList.splice(this.props.index, 1);
        //                              //Refresh list
                                     
        //                              let collection: any = {}
        //                              collection.user_email = this.props.routeObject.params.userEmail;
        //                              collection.profile_name = this.props.routeObject.params.item.profileName;
        //                              collection.device_address = this.props.item.device_address;
        //                              collection.device_name = this.props.item.device_name;
        //                              collection.device_type = this.props.item.device_type;
        //                              // console.warn(collection);
        //                              console.log(collection)
                                    
        //                              /* deleting a saved recording route is not yet created.
        //                             axios.post(getAddressString() + '/profiles/deleteProfile', collection).then((response) => {
        //                                  console.log(response.status)
        //                                  //splice the item to the list and then refresh the list
        //                                  //which would rerender the component
        //                                  this.props.deviceList.splice(this.props.index, 1);
        //                                  this.props.parentFlatList.refreshListDelete(rowToDelete);
        //                              }, ({error, response}) => {
        //                                  console.log(response.data.message);
        //                              })*/
                                    
                                    
        //                          }},
        //                      ],
        //                     {cancelable: true}
        //                 )
        //             },
        //                 text: 'Delete', type: 'delete'
        //         }
        //     ],
        //     rowId: this.props.index,
        //     sectionId: 1
        // };
        return(
            <View style={{backgroundColor:"#222222"}}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => this.props.navigation.navigate("Recorded Video Screen", this.props.item.url)}>
                    <Text style={{color: '#000', fontSize: 20}}>{this.props.item.key}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export class SavedRecordingsList extends Component<{navigation: any, stackScreen: string, routeObject: any}, {deletedRowKey: any, insertedRowKey: any, deviceList: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deletedRowKey: null,
            insertedRowKey: null,
            deviceList: []
        });
        this.launchModal = this.launchModal.bind(this);
        this.getRecordingsFromProfile = this.getRecordingsFromProfile.bind(this);
    }

    refreshListInsert = (insertedKey : any) => {
        this.setState(() => {
            return {
                insertedRowKey: insertedKey
            }
        });
        this.getRecordingsFromProfile()
   }

   refreshListDelete = (deletedKey : any) => {
    this.setState(() => {
        return {
            deletedRowKey: deletedKey
        }
    });
    this.getRecordingsFromProfile()
    }

    launchModal = () => {
        this.refs.deviceModal.showModal();
    }
    
    componentDidMount = () => {
        // this.props.navigation.setOptions({
        //     headerRight: () => (
        //         <TouchableOpacity
        //         style={{marginRight: 10}}
        //         onPress={this.launchModal}>
        //         <Icon name="ios-add" />
        //         </TouchableOpacity>  
        //       )
        // })
        this.getRecordingsFromProfile()
    }

    getRecordingsFromProfile = async() => {
        let collection: any = {}
        collection.user_email = this.props.routeObject.userEmail;
        // console.log(collection.user_email)
        collection.profile_name = this.props.routeObject.item.profileName;
        // console.log(collection.profile_name)
    
        await axios.post(getAddressString() + '/get_key_list', collection).then((response) => {
            console.log("made it inside post");
            // console.log(response.data);
            this.setState({deviceList: response.data.keyList});
            this.trimRecordingsList();
            console.log(this.state.deviceList);
        }, (error) => {
            console.log("made it inside post error");
            console.log(error);
        })
    }

    //Function to trim key names of files to get a short name (video date/time) to display on video button
    trimRecordingsList = () => {
        // console.log("TrimmingRecordingsNames");
        // console.log(this.state.deviceList);
        for(let i = 0; i < this.state.deviceList.length; i++)
        {
            // console.log(this.state.deviceList[i]);
            this.state.deviceList[i].key = this.state.deviceList[i].key.substring(this.state.deviceList[i].key.lastIndexOf("/") + 1);
            this.state.deviceList[i].key = this.state.deviceList[i].key.substring(0, this.state.deviceList[i].key.lastIndexOf("_GMT"));
        }
        // console.log(this.state.deviceList);
    }

    render(){
        //console.log(this.props.routeObject)
       return (
            <View style={{flex: 1, backgroundColor: "#222222", alignItems: 'center', paddingTop: 20}}>
                <FlatList
                    data={this.state.deviceList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <SavedRecordingItem item={item} index={index} parentFlatList={this} stackScreen={this.props.stackScreen} navigation={this.props.navigation} routeObject={this.props.routeObject} deviceList={this.state.deviceList} />
                        );
                    }}
                />
                {/* <DeviceModal ref={'deviceModal'} stackScreen={this.props.stackScreen} routeObject={this.props.routeObject} parentFlatList={this} deviceList={this.state.deviceList} /> */}
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

    ImageStyle: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: width-40,
        height: height
    }

})