import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './containers/Global/Home.js';
import RegisterUser from './containers/Forms/RegisterUser.js';
import CropperHoldingPage from './containers/Forms/CropperHoldingPage.js';
import SignIn from './containers/Global/SignIn.js';
import Landing from './containers/Global/Landing.js';
import Favourites from './containers/Global/Favourites.js';
import Map from './containers/Global/Map.js';
import BrandForm from './containers/Forms/BrandForm.js';
import RecipeForm from './containers/Forms/RecipeForm.js';
import UserView from './containers/ItemViews/UserView.js';
import BrandView from './containers/ItemViews/BrandView.js';
import MediaItemView from './containers/ItemViews/MediaItemView.js';
import MediaForm from './containers/Forms/MediaForm.js';
import VenueForm from './containers/Forms/VenueForm.js';
import EditUser from './containers/Forms/EditUser.js';
import RecipeList from './containers/ListViews/RecipeList.js';
import VenueList from './containers/ListViews/VenueList.js';
import Conversations from './containers/ListViews/Conversations.js';
import VenueView from './containers/ItemViews/VenueView.js';
import RecipeView from './containers/ItemViews/RecipeView.js';
import Conversation from './containers/ItemViews/Conversation.js';
import AddItemButton from './components/AddItemButton.js';
import FaveButton from './components/FaveButton.js';
import NavBar from './components/NavBar.js';
import MediaList from './containers/ListViews/MediaList.js';
import BrandList from './containers/ListViews/BrandList.js';
import ResetPassword from './containers/Global/ResetPassword.js';
import ResetLanding from './containers/Global/ResetLanding.js';
import NuVContributors from './containers/ListViews/NuVContributors.js';
import Barcode from './containers/Global/Barcode.js';
import { Constants } from 'expo'
console.disableYellowBox = true;

const navigationVariable = createStackNavigator({
  Landing: {screen: Landing},
  ResetLanding: {screen: ResetLanding},
  RegisterUser: {screen: RegisterUser},
  CropperHoldingPage: {screen: CropperHoldingPage},
  SignIn: {screen: SignIn},
  ResetPassword: {screen: ResetPassword},
  Favourites: {screen: Favourites},
  Home: {screen: Home},
  UserView: {screen: UserView},
  NavBar: {screen: NavBar},
  BrandForm: {screen: BrandForm},
  RecipeForm: {screen: RecipeForm},
  MediaForm: {screen: MediaForm},
  VenueForm: {screen: VenueForm},
  Map: {screen: Map},
  EditUser: {screen: EditUser},
  RecipeList: {screen: RecipeList},
  NuVContributors: {screen: NuVContributors},
  MediaList: {screen: MediaList},
  BrandList: {screen: BrandList},
  VenueList: {screen: VenueList},
  VenueView: {screen: VenueView},
  AddItemButton: {screen: AddItemButton},
  FaveButton: {screen: FaveButton},
  BrandView: {screen: BrandView},
  RecipeView: {screen: RecipeView},
  MediaItemView: {screen: MediaItemView},
  Barcode: {screen: Barcode},
  Conversations: {screen: Conversations},
  Conversation: {screen: Conversation}

});

const App = createAppContainer(navigationVariable)

export default App;
