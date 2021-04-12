import React, {Component, PureComponent} from 'react';
import { DrawerActions, getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, StackHeaderLeftButtonProps} from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity} from 'react-native';
import ProfilePage from './components/pages/ProfilePage';
import {LiveRecordingDevices, LiveIntercomDevices, ImageCaptureDevices, SavedRecordings, SavedImages} from './components/VideoComponent';
import HomePage from './components/pages/HomePage';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {Icon} from 'native-base'
import Login from './components/pages/loginPage';
import SignUp from './components/pages/signUpPage';
import Recording from './components/pages/RecordingPage';
import { PlayVideos } from './components/lists/SavedRecordings';
import { SmartLightDevices } from './components/LightComponent';
import SmartLight from './components/pages/SmartLightsPage';
import { showImage } from './components/pages/SavedImagePage';
import { SmartLockDevices } from './components/LockComponent';
import SmartLock from './components/pages/SmartLockPage';
import { FeaturesList } from './components/lists/FeaturesList';
import TakePhoto from './components/pages/TakePhotoPage';
import Intercom from './components/pages/IntercomPage';
import Toast from 'react-native-toast-message';
import getToastConfig from './components/configurations/toastConfig';
import { FeaturesRecordingsList } from './components/lists/FeaturesRecordingsList';

//App.tsx handles the navigation of the application

//Stack creates individual pages
const Stack = createStackNavigator();
//Drawer creates a side menu
const Drawer = createDrawerNavigator();

//The custom drawer content holds logout drawerItem (enables the onPress)
//That gets attached to the drawer navigator
function CustomDrawerContent(props : any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign Out"  
        onPress={() => props.navigation.navigate('Sign In')}
        icon={({color, size}) => (
        <Icon name="exit" style={{fontSize: size, color: color}} />)}
      />
    </DrawerContentScrollView>
  );
}

//Below creates the drawer effect inside of the Profile Page
class SelectedProfileNavigation extends Component<{route: any, navigation: any}>{

  //after the comp renders this will make sure the header changes to the page that was clicked 
  //and it creates the drawer menu in each of the pages
  componentDidMount = () => {
    //console.log(this.props.route)
    this.props.navigation.setOptions({
        headerTitle: this.props.route.params.item.profile_name,
        headerRight: () => (
          <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => {
            this.props.navigation.dispatch(DrawerActions.openDrawer())
          }}>
          <Icon name="menu" />
          </TouchableOpacity>  
        )
    })
  }
  
  shouldComponentUpdate= () => {
    return false;
  }

  render(){

    const profilePage = () => {
      return(
        <ProfilePage navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }

    const savedRecordings = () => {
      return(
        <SavedRecordings navigation={this.props.navigation} routeObject={this.props.route}/>        
      )
    }
    
    const savedImages = () => {
      return(
        <SavedImages navigation={this.props.navigation} routeObject={this.props.route}/>        
      )
    }

    const savedFacialRecognitions = () => {
      //A type of 1 is for UPLOADED_FACE_REGS
      return(
        <FeaturesList type={1} navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }

    const detectedFacialRecognitions = () => {
      //A type of 2 is for DETECTED_FACE_REGS
      return(
        <FeaturesList type={2} navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }

    const savedFacialRecognitionsRecordings = () => {
      //A type of 1 is for UPLOADED_FACE_REGS
      return(
        <FeaturesRecordingsList type={1} navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }

    const detectedMotionDetections = () => {
      //A type of 1 is for UPLOADED_FACE_REGS
      return(
        <FeaturesList type={3} navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }

    const savedMotionDetectionsRecordings = () => {
      //A type of 1 is for UPLOADED_FACE_REGS
      return(
        <FeaturesRecordingsList type={2} navigation={this.props.navigation} routeObject={this.props.route}/>
      )
    }
   
    return(
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={{
            drawerIcon:({color, size}) => (
              <Icon name="home" style={{fontSize: size, color: color}} />
            ),
          }}
          name = "Profile Page" 
          component={profilePage}
        />

        <Drawer.Screen 
          options={{
            drawerIcon:({color, size}) => (
              <Icon name="film" style={{fontSize: size, color: color}} />
            ), }}
          name="Saved Recordings" 
          component={savedRecordings}
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="camera" style={{fontSize: size, color: color}} />
          ), }}
          name="Saved Images" 
          component= {savedImages} 
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="person" style={{fontSize: size, color: color}} />
          ), 
          }}
          name="My Recognized Faces" 
          component= {savedFacialRecognitions} 
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="person" style={{fontSize: size, color: color}} />
          ), 
          }}
          name="Detected Faces" 
          component= {detectedFacialRecognitions} 
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="person" style={{fontSize: size, color: color}} />
          ), 
          }}
          name="Facial Recognition Recordings" 
          component= {savedFacialRecognitionsRecordings} 
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="person" style={{fontSize: size, color: color}} />
          ), 
          }}
          name="Motion Captures" 
          component= {detectedMotionDetections} 
        />

        <Drawer.Screen 
          options={{
          drawerIcon:({color, size}) => (
            <Icon name="person" style={{fontSize: size, color: color}} />
          ), 
          }}
          name="Motion Detection Recordings" 
          component= {savedMotionDetectionsRecordings} 
        />


      </Drawer.Navigator>
    );
  }
}

export default function App(){
  console.warn = () => {}
  return (  
  <NavigationContainer>
    <Toast style={{zIndex: 1}} config={getToastConfig()} ref={(ref) => Toast.setRef(ref)} />
    <Stack.Navigator initialRouteName="Login">
      
      <Stack.Screen 
        options={{
          headerShown: false
        }}
        name="Sign In" 
        component= {Login}
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
          },
        }}
        name="Sign Up" 
        component= {SignUp}
      />

      <Stack.Screen 
        options={{
          headerStyle: {
            backgroundColor: '#FF9900',
          },
          headerLeft: ((props: StackHeaderLeftButtonProps) => null),
          gestureEnabled: false
        }}
        name="Home" 
        component= {HomePage}
      />

      <Stack.Screen 
        name="Profile" 
        component= {SelectedProfileNavigation} 
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile Page';
      
          switch (routeName) {
            case 'Profile Page': {
              return {
                headerTitle: 'Profile Page',
                headerStyle: {
                  backgroundColor: '#FF9900',
                } 
              };
            }
            case 'Saved Images': {
              return {
                headerTitle: 'Saved Images',
                headerStyle: {
                  backgroundColor: '#FF9900'
                } 
              };
            }
            case 'Saved Recordings':
            default: {
              return {
                headerTitle: 'Saved Recordings',
                headerStyle: {
                  backgroundColor: '#FF9900'
                } 
              };
            }
          }
        }}
      /> 

     {/* <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Live Streaming Devices" 
        component= {LiveStreamingDevices} 
      />
      
      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Streaming Devices" 
        component= {Streaming} 
      /> */}
      
     <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Live Intercom Devices" 
        component= {LiveIntercomDevices} 
      /> 
      
      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Intercom Devices" 
        component= {Intercom} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Live Recording Devices" 
        component={LiveRecordingDevices} 
      />
      
      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Recording Devices" 
        component= {Recording} 
      />
      
      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Recorded Video Screen" 
        component= {PlayVideos} 
      />  
      
       <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Image Capture Devices" 
        component={ImageCaptureDevices} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Take Photo" 
        component= {TakePhoto} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Image Screen" 
        component= {showImage} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Smart Light Devices" 
        component={SmartLightDevices} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Smart Lights" 
        component={SmartLight} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Smart Lock Devices" 
        component={SmartLockDevices} 
      />

      <Stack.Screen 
        options={{
          headerStyle: {
          backgroundColor: '#FF9900'
        }}} 
        name="Smart Lock" 
        component={SmartLock} 
      />

    </Stack.Navigator>
  </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
