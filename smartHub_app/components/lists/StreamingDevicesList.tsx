import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base'
import DeviceModal from '../modals/modalForAddingDevice';

var sampleList = [
    {DeviceName: "Web Cam x360",},
    {DeviceName: "Security Camera B121"}]
var width : number = Dimensions.get('window').width;

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    index: any,
    parentFlatList: any,
    navigation: any
}

interface StateVariables{
    activeRowKey : any
}

//This class is for each "individual item" in the Profile List (the ProfileList class is below this one)
class StreamingListItem extends Component<PropVariables,StateVariables>{
    constructor(props: any){
        super(props);
        this.state= ({
            activeRowKey: null
        });
    }
    render(){
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
                            'Are you sure you want to delete this profile?',
                            [
                                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Yes', onPress: () => {
                                    sampleList.splice(this.props.index, 1);
                                    //Refresh list
                                    this.props.parentFlatList.refreshList(rowToDelete);
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
            <Swipeout {...swipeSettings} style={{backgroundColor:"#222222"}}>
            <TouchableOpacity
            style={styles.pillButton}
            onPress={() => this.props.navigation.navigate('Live Stream', this.props.item)}>
            <Text style={{color: '#000', fontSize: 20}}>{this.props.item.DeviceName}</Text>
            </TouchableOpacity>
            </Swipeout>
        );
    }
}

export class StreamingDevicesList extends Component<{navigation: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            deletedRowKey: null
        });
        this.launchModal = this.launchModal.bind(this);
    }

    refreshList = (deletedKey : any) => {
        this.setState(() => {
            return {
                deletedRowKey: deletedKey
            }
        });
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
    }
    render(){ 
        return (
            <View style={{flex: 1, backgroundColor: "#222222"}}>
                <Text style={{paddingTop: 18, fontSize: 18, color: "#fff", fontWeight: 'bold', textAlign: 'center', paddingBottom: 20}}>Select the device you would like to stream from:</Text>
                <FlatList
                    data={sampleList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <StreamingListItem item={item} index={index} parentFlatList={this} navigation={this.props.navigation}/>
                        );
                    }} />
                <DeviceModal ref={'deviceModal'}  parentFlatList={this} sampleList={sampleList} />
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

})