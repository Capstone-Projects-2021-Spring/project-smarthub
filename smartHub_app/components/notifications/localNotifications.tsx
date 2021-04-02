import React, { Component } from "react";
import {Platform, Text, View, TouchableOpacity, Button} from 'react-native'
//import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token: any) {
    console.log("TOKEN:", token);
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification: any) {
    console.log("NOTIFICATION:", notification);
    //notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: Platform.OS === 'ios',
});

export default class LocalNotifications extends Component{
    
  sendPushNotification = () => {
        //Below will remove all sent notifications
        //PushNotification.removeAllDeliveredNotifications();  
        PushNotification.localNotification({
          channelId: "smartHub-channel",
          smallIcon: "ic_notification", 
          showWhen: true, // (optional) default: true
          autoCancel: true, // (optional) default: true
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
          largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
          bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
          subText: "This is a subText", // (optional) default: none
          title: "ALERT FACE RECOGNIZED", // (optional)
          message: "...", // (required)
          bigPictureUrl: "https://image.pngaaa.com/922/2623922-middle.png", // (optional) default: undefined
          vibrate: true, // (optional) default: true
          color: "red"

        })
    }

    componentDidMount = async () => {
      //Channel must be made to make connection
      PushNotification.createChannel(
        {
          channelId: "smartHub-channel", // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created: any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
    render(){
        return(
          <View>
              <Button title="Send Notification" onPress={()=>this.sendPushNotification()}></Button>
          </View>
        )
    }
}