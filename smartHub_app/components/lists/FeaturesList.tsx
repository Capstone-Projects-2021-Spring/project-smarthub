import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Alert, Image} from 'react-native';
import axios from 'axios';
import {Icon} from 'native-base'
import FacialRecognitionModal from '../modals/modalForFacialRecognition';

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
            <View style={{backgroundColor:"#222222"}}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => this.props.navigation.navigate("Image Screen", this.props.item.image_link)}>
                    <Text style={{color: '#000', fontSize: 20}}>{this.props.item.image_name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export class FeaturesList extends Component<{type: number, navigation: any, routeObject: any}, {featuresList: any, userEmail: String}>{

    constructor(props: any){
        super(props);
        this.state = ({
            userEmail: "",
            featuresList: []
        });
    }

    launchModal = () => {
        this.refs.facialRecognitionModal.showModal();
    }
    
    componentDidMount = () => {
        this.getDataList()
    }

    getDataList = async() => {
        let collection: any = {}
        collection.image_type = this.props.type;
        collection.profile_id = this.props.routeObject.params.item.profile_id;
        console.log(collection);
        await axios.post('http://petepicam1234.zapto.org:4000/images/getImages', collection).then(async (response) => {
            this.setState({featuresList: response.data.images});
        }, (error) => {
            console.log(error);
        })
    }

    render(){
       return (
            <View style={{flex: 1, backgroundColor: "#222222", alignItems: 'center', paddingTop: 20}}>
                <View>
                    <TouchableOpacity
                        style={styles.pillButtonNew}
                        onPress={this.launchModal}>
                        <Icon name="ios-add" />
                    </TouchableOpacity>           
                    <FlatList
                        data={this.state.featuresList}
                        renderItem={({item, index} : any)=>{
                            return(
                                <FeatureListItem item={item} navigation={this.props.navigation}/>
                            );
                        }}
                    /> 
                </View>
                <FacialRecognitionModal ref={'facialRecognitionModal'} routeObject={this.props.routeObject} navigation={this.props.navigation} parentFlatList={this}/>
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