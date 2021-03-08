import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Alert} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {Icon} from 'native-base'
import ProfileModal from '../modals/modalForProfileList';


var sampleList = [{key: 'Profile 1'}, {key: 'Profile 2'}, {key: 'Profile 3'}, {key: 'Profile 4'}, {key: 'Profile 5'}, {key: 'Profile 6'}];

interface PropVariables{
    item: any,
    index: any,
    parentFlatList: any,
    navigation: any
}

interface StateVariables{
    activeRowKey : any
}

class ProfileListItem extends Component<PropVariables,StateVariables>{
    constructor(props: any){
        super(props);
        this.state= ({
            activeRowKey: null
        });
    }

    render(){
        let {itemStyle, itemText} = styles;
        
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
            <Swipeout {...swipeSettings}>
            <TouchableOpacity
            style={itemStyle}
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={{color: '#fff'}}>{this.props.item.key}</Text>
            </TouchableOpacity>
            </Swipeout>
        );
    }
}

export default class ProfileList extends Component<{navigation: any}>{

    constructor(props : any){
        super(props);
        this.state = ({
            deletedRowKey: null
        });
        this.launchModal = this.launchModal.bind(this);
    }

    refreshList = (deletedKey : any) => {
         this.setState((prevState) => {
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
    })}

    render(){
    return (
        <View style={styles.container}>
            <FlatList
                data={sampleList}
                renderItem={({item, index} : any)=>{
                    return(
                        <ProfileListItem item={item} index={index} parentFlatList={this} navigation={this.props.navigation}></ProfileListItem>
                    );
                }}
            />
            <ProfileModal ref={'profileModal'}  parentFlatList={this} sampleList={sampleList} />
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#293241'
    },
    itemStyle: {
        backgroundColor: '#222222',
        height: 100,
        margin: 10,
        flex:1
    },

    itemText: {
        color: '#fff',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 40
    }
})
