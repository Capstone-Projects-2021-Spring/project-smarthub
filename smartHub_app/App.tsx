import React, {Component} from 'react';
import { DrawerActions, getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, StackHeaderLeftButtonProps} from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity} from 'react-native';
import ProfilePage from './components/pages/ProfilePage';
import {LiveRecordingDevices, SavedRecordings, SavedImages } from './components/VideoComponent';
import HomePage from './components/pages/HomePage';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {Icon} from 'native-base'
import Login from './components/pages/loginPage';
import SignUp from './components/pages/signUpPage';
import Recording from './components/pages/RecordingPage';
import { PlayVideos } from './components/lists/SavedRecordings';
import { SmartLightDevices } from './components/LightComponent';
import SmartLight from './components/pages/SmartLightsPage';
import { SmartLockDevices } from './components/LockComponent';
import SmartLock from './components/pages/SmartLockPage';
import { NavigationActions } from 'react-navigation';

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
    //console.log(this.props.route.params)
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
          component= {SavedImages} 
        />
      </Drawer.Navigator>
    );
  }
}

export default function App(){
  console.warn = () => {}
  return (  
  <NavigationContainer>
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
