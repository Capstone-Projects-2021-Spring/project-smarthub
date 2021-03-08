import React, {useEffect} from 'react';
import { DrawerActions, getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity} from 'react-native';
import ProfilePage from './components/pages/ProfilePage';
import { LiveStream, Record, SavedRecordings, SavedImages } from './components/VideoComponent';
import HomePage from './components/pages/HomePage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Icon} from 'native-base'

//App.tsx handles the navigation of the application

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function SelectedProfile({ navigation } : {navigation: any}){
  
  useEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer())
            }}>
            <Icon name="menu" />
            </TouchableOpacity>  
    )}
    )
})
  return(
  <Drawer.Navigator>
    <Drawer.Screen
    options={{
      drawerIcon:({focused, color, size}) => (
        <Icon name="home" style={{fontSize: size, color: color}} />
      ), }}
    name = "Profile Page" 
    component={ProfilePage}/>
    <Drawer.Screen 
    options={{
      drawerIcon:({focused, color, size}) => (
        <Icon name="film" style={{fontSize: size, color: color}} />
      ), }}
    name="Saved Recordings" 
    component= {SavedRecordings} />
    <Drawer.Screen 
    options={{
      drawerIcon:({focused, color, size}) => (
        <Icon name="camera" style={{fontSize: size, color: color}} />
      ), }}
    name="Saved Images" 
    component= {SavedImages} />
  </Drawer.Navigator>
  );
}


export default function App({ navigation } : {navigation: any}) {
  return (
  
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      
      <Stack.Screen 
      options={{
        headerStyle: {
        backgroundColor: '#EDB230'
        },
      }}
      name="Home" 
      component= {HomePage}/>

      <Stack.Screen 
      name="Profile" 
      component= {SelectedProfile} 
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile Page';
    
        switch (routeName) {
          case 'Profile Page': {
            return {
              headerTitle: 'Profile Page',
              headerStyle: {
                backgroundColor: '#EDB230'
              } 
            };
          }
          case 'Saved Images': {
            return {
              headerTitle: 'Saved Images',
              headerStyle: {
                backgroundColor: '#EDB230'
              } 
            };
          }
          case 'Saved Recordings':
          default: {
            return {
              headerTitle: 'Saved Recordings',
              headerStyle: {
                backgroundColor: '#EDB230'
              } 
            };
          }
        }
      }}
      /> 

      <Stack.Screen 
      options={{
        headerStyle: {
        backgroundColor: '#EDB230',
      }}} 
      name="Live Stream" 
      component= {LiveStream} />
      
      <Stack.Screen 
      options={{
        headerStyle: {
        backgroundColor: '#EDB230',
      }}} 
      name="Record" 
      component= {Record} />
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
