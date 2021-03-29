import React, {Component} from 'react';
import { DevicesList } from './lists/DevicesList';

export class SmartLockDevices extends Component<{route: any, navigation: any}>{
    render(){
        console.log(this.props.route.params);
        return (
            <DevicesList routeObject={this.props.route.params} stackScreen={'Smart Lock'} navigation={this.props.navigation}/>
        )
    }
}
