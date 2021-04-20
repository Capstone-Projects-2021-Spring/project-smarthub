import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview'
import axios from 'axios'
import Toast, {BaseToast} from 'react-native-toast-message'
import { getAddressString } from '../../utils/utilities';
import Stream from '../video/Streaming';

var width : number = Dimensions.get('window').width;


export default class Intercom extends Component<{ route: any, navigation: any }, { profileId: number, phoneNumber: String, deviceIP: String, userEmail: String, profileName: String}>{

    constructor(props: any) {
        super(props);
        this.state = ({
            deviceIP: "",
            userEmail: "",
            profileName: "",
            phoneNumber: "",
            profileId: 0
        })
    }
    getDeviceInfo = async () => {
        //console.log(this.props.route);
        let collection: any = {}
        collection.device_id = this.props.route.params.device_id;
        await axios.post(getAddressString() + '/devices/getDeviceInfo', collection).then((response) => {
            this.setState({deviceIP: response.data.device[0].device_address,
                userEmail: response.data.device[0].user_email,
                profileName: response.data.device[0].profile_name,
                profileId: response.data.device[0].profile_id,
                phoneNumber: response.data.device[0].phone_number})
        }, (error) => {
            console.log(error);
        })
    }

    componentDidMount = async() => {
            await this.getDeviceInfo();
             this.props.navigation.setOptions({
                headerTitle: this.props.route.params.device_name,
            })
    }

    render(){
        const toastConfig = {
            success: ({ text1, text2, ...rest } : any) => (
              <BaseToast
                {...rest}
                style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                  fontSize: 18,
                  fontWeight: 'bold'
                }}
                text2Style={{
                    color: "#000",
                    fontSize: 12
                }}
                text1={text1}
                text2={text2}
              />
            ),

            error: ({ text1, text2, ...rest } : any) => (
                <BaseToast
                  {...rest}
                  style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff" }}
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  text1Style={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                  text2Style={{
                      color: "#000",
                      fontSize: 10
                  }}
                  text1={text1}
                  text2={text2}
                />
              )
        }
        return(
            <View style={{flex:1, backgroundColor: "#222222"}}>
                <Toast style={{zIndex: 1}} config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                <Stream type={2} deviceIP={this.state.deviceIP} deviceId={this.props.route.params.device_id} navigation={this.props.navigation} userEmail={this.state.userEmail} profileName={this.state.profileName}
                profileId={this.state.profileId} phoneNumber={this.state.phoneNumber}/>                
            </View>
        );
    }
}