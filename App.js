import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './containers/Global/Home.js';
import Register from './containers/Forms/RegisterUser.js';
import SignIn from './containers/Global/SignIn.js';
import Landing from './containers/Global/Landing.js';
import BrandForm from './containers/Forms/BrandForm.js';
import MyProfile from './containers/ItemViews/UserView.js';
import MediaForm from './containers/Forms/MediaForm.js';
import NavBar from './components/NavBar.js';
import { Constants } from 'expo'

const navigationVariable = createStackNavigator({
  Landing: {screen: Landing},
  Register: {screen: Register},
  SignIn: {screen: SignIn},
  Home: {screen: Home},
  MyProfile: {screen: MyProfile},
  NavBar: {screen: NavBar},
  BrandForm: {screen: BrandForm},
  MediaForm: {screen: MediaForm}
});

const App = createAppContainer(navigationVariable)

export default App;
