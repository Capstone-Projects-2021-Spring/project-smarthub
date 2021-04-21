import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base';
import axios from 'axios';
import DeviceModal from '../modals/modalForAddingDevice';
import {getAddressString} from '../../utils/utilities';
import RoundedDeviceListButton from '../buttons/RoundedDeviceListButton';

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
}

interface StateVariables{
    activeRowKey : any,
}

//This class is for each "individual item" in the Profile List (the ProfileList class is below this one)
class ListItem extends Component<PropVariables,StateVariables>{
    constructor(props: any){
        super(props);
        this.state= ({
            activeRowKey: null,
        });
    }
    render(){
        //console.log(this.props.routeObject)
        let routeObject = {
            device_name: this.props.item.device_name,
            device_id: this.props.item.device_id,
            device_type: this.props.stackScreen
        }
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
                        const rowToDelete = this.state.activeRowKey;
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ' + this.props.item.device_name,
                            [
                                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Yes', onPress:  () => {
                                    // this.props.deviceList.splice(this.props.index, 1);
                                     //Refresh list
                                     
                                     let collection: any = {}
                                     collection.device_id= routeObject.device_id;
                                     // console.warn(collection);
                                     
                                    axios.post(getAddressString() + '/devices/deleteDevice', collection).then((response) => {
                                         //splice the item to the list and then refresh the list
                                         //which would rerender the component
                                         console.log("Device " + this.props.item.device_name + " successfully deleted.");
                                         this.props.deviceList.splice(this.props.index, 1);
                                         this.props.parentFlatList.getDevices();
                                     }, ({error, response}) => {
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
            <Swipeout {...swipeSettings} style={{backgroundColor:"#151621"}}>
            <RoundedDeviceListButton
            onPress={() => this.props.navigation.navigate(this.props.stackScreen, routeObject)}
            buttonText={this.props.item.device_name}>
            </RoundedDeviceListButton>
            </Swipeout>
        );
    }
}

export class DevicesList extends Component<{navigation: any, stackScreen: string, routeObject: any}, {deviceList: any, checkData: boolean}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deviceList: [],
            checkData: false

        });
        this.launchModal = this.launchModal.bind(this);
        this.getDevices = this.getDevices.bind(this);
    }

    launchModal = () => {
        this.refs.deviceModal.showModal();
    }
    
    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={this.launchModal}>
                <Icon name="ios-add" />
                </TouchableOpacity>  
              )
        })
        this.getDevices()
    }

    getDevices = async() => {

        let collection: any = {}
        collection.profile_id = this.props.routeObject.params.item.profile_id;
        collection.device_type = this.props.stackScreen === 'Take Photo' ? 'Recording Devices' : this.props.stackScreen;
       
        await axios.post(getAddressString() + '/devices/getDevices', collection).then((response) => {
            //return response.data.profiles
            if(response.data.devices.length === 0){
                this.setState({checkData: true});
            }else{
                this.setState({checkData: false, deviceList: response.data.devices});
            }
        }, (error) => {
            console.log("ERROR GETTING DEVICES")
            console.log(error)
        })

    }
    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#151621", alignItems: 'center', paddingTop: 20}}>
                <FlatList
                    data={this.state.deviceList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <ListItem item={item} index={index} parentFlatList={this} stackScreen={this.props.stackScreen} navigation={this.props.navigation} deviceList={this.state.deviceList} />
                        );
                    }}
                    keyExtractor={item => item.device_id.toString()}
                    ListEmptyComponent={() => {
                        if(this.state.checkData){
                            return(
                                <View style={{marginTop: height/12, flex: 1, alignItems: 'center', height: height/2, justifyContent: 'center'}}>
                                    <Text style={{paddingTop: 18, fontSize: 17, color: "#fff", fontWeight: 'bold'}}>Looks like you haven't added any Devices.</Text>
                                    <Text style={{paddingTop: 18, fontSize: 15, color: "#fff", fontWeight: 'bold', paddingBottom: 20}}>Click the "+" on the top right to add a new Device.</Text>
                                    <Image resizeMode={'contain'} style={styles.ImageStyle} source={{uri: 'https://www.pngkit.com/png/full/118-1180951_image-transparent-icons-free-color-desktops-and-gadgets.png'}}/>
                                </View>
                        )}else{
                            return null;
                        }
                    }}
                />
                <DeviceModal ref={'deviceModal'} stackScreen={this.props.stackScreen} routeObject={this.props.routeObject} parentFlatList={this} deviceList={this.state.deviceList} />
            </View>
        );
    }
}

const styles = StyleSheet.create ({
    
    ImageStyle: {
        width: "100%",
        height: "76%"
    }
})