import React, {Component, useState, useEffect} from 'react';
import {View} from 'react-native';

// import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
// import {createBottomTabNavigator} from 'react-navigation-tabs';
// import {setNavigator} from './src/navigationRef';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {navigationRef} from './src/RootNavigation';

const Stack = createStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const BottomTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import combineReducers from './src/redux/reducer';

import {connect} from 'react-redux';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavouriteScreen from './src/screens/FavouriteScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import JoinQueueScreen from './src/screens/JoinQueueScreen';
import SearchShopScreen from './src/screens/SearchShopScreen';
import ShopInformationScreen from './src/screens/ShopInformationScreen';
import QueuedSuccessfulScreen from './src/screens/QueuedSuccessfulScreen';
import ViewQueueScreen from './src/screens/ViewQueueScreen';
import ShopFilterScreen from './src/screens/ShopFilterScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import {retrieveJWT, removeJWT} from './src/asyncStorage';

// let isAuth = false;
// let isAuth = false;

// const jwt = retrieveJWT();
// if (jwt != null) {
//   console.log('jwt', jwt);
//   isAuth = false;
// }
// if (this.props.jwt != null) {
//   isAuth = true;
// }

const createProfileStack = () => {};

const createShopQueueStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // headerTitleStyle: {color: '#8E54E9'},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchShop"
        component={SearchShopScreen}
        // options={{headerTitle: 'Search Shop'}}
      />
      <Stack.Screen name="ShopFilter" component={ShopFilterScreen} />
      <Stack.Screen name="JoinQueue" component={JoinQueueScreen} />
      <Stack.Screen
        name="QueuedSuccessful"
        component={QueuedSuccessfulScreen}
      />
      <Stack.Screen name="ShopInformation" component={ShopInformationScreen} />
      <Stack.Screen name="ViewQueue" component={ViewQueueScreen} />
    </Stack.Navigator>
  );
};

const createHome = () => {
  return (
    <BottomTabs.Navigator
      tabBarOptions={{
        activeTintColor: '#8E54E9',
      }}>
      <BottomTabs.Screen
        name="Home"
        children={createShopQueueStack}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
      />
      {/* <BottomTabs.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="heart" size={20} color={color} />
          ),
        }}
      /> */}
      <BottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => <Icon name="user" size={20} color={color} />,
        }}
      />
    </BottomTabs.Navigator>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const getTokenAsync = async () => {
      const jwt = await retrieveJWT();
      if (jwt != null) {
        setIsAuth(true);
      }
    };
    getTokenAsync();

    // const removeTokenAsync = async () => {
    //   await removeJWT();
    // };
    // removeTokenAsync();
  }, []);

  return !isAuth ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Home" children={createHome} /> */}
      <Stack.Screen name="Home" children={createShopQueueStack} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  ) : (
    // <>{createHome()}</>
    <>{createShopQueueStack()}</>
  );
};

const store = createStore(combineReducers, {}, applyMiddleware(ReduxThunk));

export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <App />
      </NavigationContainer>
    </Provider>
  );
};

const mapStateToProps = state => {
  return {
    jwt: state.auth.jwt,
  };
};

connect(
  mapStateToProps,
  null,
)(App);
