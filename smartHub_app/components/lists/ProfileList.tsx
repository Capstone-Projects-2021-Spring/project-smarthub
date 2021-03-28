import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Alert, Dimensions, Image, ImageBackground} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base'
import ProfileModal from '../modals/modalForProfileList';
import { BackHandler } from 'react-native';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//Sample data
var sampleList: any = [{profileName: '123 Sample Street'}];

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    index: any,
    parentFlatList: any,
    navigation: any,
    userEmail: string
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
        let userEmail = this.props.userEmail;
        let {itemStyle} = styles;
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
            <Swipeout {...swipeSettings} style={{backgroundColor:"#222222"}} >
            <TouchableOpacity
            style={itemStyle}
            onPress={() => this.props.navigation.navigate('Profile', {item, userEmail})}>
            <Text style={{paddingLeft: 5, paddingTop: 5, fontWeight: 'bold', fontSize: 20, color: '#fff'}}>{this.props.item.profileName}</Text>
            <Image style={{flex:1, height: 10, width: 20}} source={{uri: this.props.item.image}}/>
            </TouchableOpacity>
            </Swipeout>
        );
    }
}

//Creates the list of profiles that are present on the home page
export default class ProfileList extends Component<{navigation: any, userEmail: string}>{

    constructor(props : any){
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
        this.refs.profileModal.showModal();
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
                    style={{flex:1}}
                    data={sampleList}
                    renderItem={({item, index} : any)=>{
                        return(
                            <ProfileListItem item={item} index={index} userEmail={this.props.userEmail} parentFlatList={this} navigation={this.props.navigation}></ProfileListItem>
                        );
                    }}
                    ListEmptyComponent={() => {
                        return(
                            <View style={{marginTop: height/7, flex: 1, alignItems: 'center', height: height/2, justifyContent: 'center'}}>
                                <Text style={{paddingTop: 18, fontSize: 18, color: "#fff", fontWeight: 'bold'}}>Looks like you haven't added any Profiles.</Text>
                                <Text style={{paddingTop: 18, fontSize: 15, color: "#fff", fontWeight: 'bold', paddingBottom: 20}}>Click the "+" on the top right to add a new Profile.</Text>
                                <Image style={styles.ImageStyle} source={{uri: 'https://image.flaticon.com/icons/png/512/122/122935.png'}}/>
                            </View>
                        )
                    }}
                />
                <ProfileModal ref={'profileModal'} parentFlatList={this} sampleList={sampleList} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
    },
    itemStyle: {
        backgroundColor: '#000',
        height: 90,
        margin: 10,
        borderWidth: 2,
        borderColor: "#ffa31a",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.00,
        elevation: 10,
        flex:1
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
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: width-60,
        height: height-20
    }
})
