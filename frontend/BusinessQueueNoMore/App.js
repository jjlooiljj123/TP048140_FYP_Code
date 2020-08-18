import React, {Component, useState, useEffect} from 'react';
import {View, Text} from 'react-native';

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
import OthersScreen from './src/screens/OthersScreen';
import CreateShopInfoScreen from './src/screens/CreateShopInfoScreen';
import ShopInformationScreen from './src/screens/ShopInformationScreen';
import EditShopInformation from './src/screens/EditShopInformation';
import CreateQueuePlanScreen from './src/screens/CreateQueuePlanScreen';
import ViewQueueScreen from './src/screens/ViewQueueScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

import Icon from 'react-native-vector-icons/FontAwesome';

import {retrieveJWT, removeJWT} from './src/asyncStorage';

const createShopInformationStakc = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Shop" component={ShopInformationScreen} />
      <Stack.Screen name="EditShop" component={EditShopInformation} />
      <Stack.Screen name="CreateShopInfo" component={CreateShopInfoScreen} />
    </Stack.Navigator>
  );
};

const createHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ViewQueue" component={ViewQueueScreen} />
    </Stack.Navigator>
  );
};

const createBottomTab = () => {
  return (
    <BottomTabs.Navigator
      tabBarOptions={{
        activeTintColor: '#8E54E9',
      }}>
      <BottomTabs.Screen
        name="Home"
        children={createHomeStack}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
      />
      <BottomTabs.Screen
        name="Shop"
        children={createShopInformationStakc}
        options={{
          tabBarIcon: ({color}) => <Icon name="bank" size={20} color={color} />,
        }}
      />
      <BottomTabs.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="bar-chart" size={20} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Others"
        component={OthersScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="navicon" size={20} color={color} />
          ),
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
      <Stack.Screen name="Home" children={createBottomTab} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CreateShopInfo" component={CreateShopInfoScreen} />
      <Stack.Screen name="CreateQueuePlan" component={CreateQueuePlanScreen} />
    </Stack.Navigator>
  ) : (
    <>{createBottomTab()}</>
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

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
  };
};

connect(mapStateToProps, null)(App);
