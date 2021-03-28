import React, {Component} from 'react';
import { DevicesList } from './lists/DevicesList';

export class SmartLightDevices extends Component<{route: any, navigation: any}>{
    render(){
        return (
            <DevicesList routeObject={this.props.route.params} stackScreen={'Smart Lights'} navigation={this.props.navigation}/>
        )
    }
}
