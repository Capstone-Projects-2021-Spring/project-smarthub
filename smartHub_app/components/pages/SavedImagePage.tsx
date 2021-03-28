// import { Video } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions} from 'react-native';

var width : number = Dimensions.get('window').width;
var height : number = Dimensions.get('window').height;

export class showImage extends Component<{navigation: any, stackScreen: string, route: any}, {retrievedImage: any}>{

    constructor(props: any){
        super(props);
        this.state = ({
            retrievedImage: "",
            
        });
    }
    
    render(){
        return (
            <View style={styles.container}>  
                <Image 
                    style={{flex: 1, width:width-10, marginBottom: 100}}
                    resizeMode= "contain"
                    source={{uri: this.props.route.params}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
    },
});