import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import axios from 'axios';
import {Icon} from 'native-base'
import RoundedDeviceListButton from '../buttons/RoundedDeviceListButton';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

//Need to create the interfaces to define the types for props and state variables

interface PropVariables{
    item: any,
    navigation: any,
}

class FeatureListItem extends Component<PropVariables>{
    render(){
        return(
            <View style={{backgroundColor:"#151621"}}>
                <RoundedDeviceListButton onPress={() => this.props.navigation.navigate("Recorded Video Screen", this.props.item.recording_link)} buttonText={this.props.item.date_created}></RoundedDeviceListButton>
            </View>
        );
    }
}

export class FeaturesRecordingsList extends Component<{type: number, navigation: any, routeObject: any}, {featuresList: any, userEmail: String}>{

    constructor(props: any){
        super(props);
        this.state = ({
            userEmail: "",
            featuresList: []
        });
    }
    
    componentDidMount = () => {
        this.getDataList()
    }

    getDataList = async() => {
        let collection: any = {}
        collection.recording_type = this.props.type;
        collection.profile_id = this.props.routeObject.params.item.profile_id;
        console.log(collection);
        await axios.post('http://petepicam1234.zapto.org:4000/recordings/getRecordings', collection).then(async (response) => {
            this.setState({featuresList: response.data.recordings});
        }, (error) => {
            console.log(error);
        })
    }

    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#151621", alignItems: 'center', paddingTop: 20}}>
                <View>         
                    <FlatList
                        data={this.state.featuresList}
                        renderItem={({item, index} : any)=>{
                            return(
                                <FeatureListItem item={item} navigation={this.props.navigation}/>
                            );
                        }}
                    /> 
                </View>
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