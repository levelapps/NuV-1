import React from 'react';
import { StyleSheet, Linking, Platform, TouchableHighlight, ScrollView, Dimensions, Button, Text, View } from 'react-native';
import { Constants } from 'expo'
import * as TimeGreeting from '../../helper_functions/TimeGreeting.js';
import NavBar from '../../components/NavBar.js';
import AddItemButton from '../../components/AddItemButton.js';
import LoadingCelery from '../../components/LoadingCelery.js';
import FaveButton from '../../components/FaveButton.js';
import LikeButton from '../../components/LikeButton.js';
import ShareButton from '../../components/ShareButton.js';
import AutoHeightImage from 'react-native-auto-height-image';
import    GuestRegistrationOffer from '../../components/GuestRegistrationOffer.js';
import GlobalButton from '../../components/GlobalButton.js';
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
import StarRating from 'react-native-star-rating';
import { AsyncStorage, Alert } from "react-native"
import axios from 'axios';
import LikersOverlay from '../../components/LikersOverlay.js';
import    Comments from '../Global/Comments.js';

export default class MediaView extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle: (
      <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
 ),
}

      constructor(props) {
      super(props);

      this.onStarRatingPress = this.onStarRatingPress.bind(this);
      this.addMediaItemToFavourites = this.addMediaItemToFavourites.bind(this);
      this.checkFavouriteStatus = this.checkFavouriteStatus.bind(this);
      this.postLike = this.postLike.bind(this);
      this.openLikersOverlay = this.openLikersOverlay.bind(this);
      this.closeLikersOverlay = this.closeLikersOverlay.bind(this);
      this.openRegistrationOverlay = this.openRegistrationOverlay.bind(this);
      this.closeRegistrationOverlay = this.closeRegistrationOverlay.bind(this);
      this.handleRegistrationRequest = this.handleRegistrationRequest.bind(this);
      }

      state = {
          starRating: 3,
          starCount: 2,
          likersOverlayVisible: false,
          registrationOverlayVisible: false,
        };

    componentDidMount(){

      var mediaItem = this.props.navigation.getParam('mediaItem', 'NO-ID');
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;

      if (mediaItem.user_id){
        axios.get(`http://nuv-api.herokuapp.com/media/${mediaItem.id}`,

     { headers: { Authorization: `${token}` }})

     .then(function(response){

       var mediaItem = JSON.parse(response.request['_response'])

       self.setState({
         mediaItem: mediaItem,
         likedItem: mediaItem.already_liked,
         likes: mediaItem.likes,
         likers: mediaItem.likers
       },
       function(){
         console.log("Media item", self.state.mediaItem);
       }
     )
     }).catch(function(error){
       console.log("Error: ", error);
     })
   }

    else {
      console.log("Media item: ", mediaItem);
     this.setState({
       mediaItem: mediaItem
     })
    }

    }

    openRegistrationOverlay(){
      this.setState({
        registrationOverlayVisible: true
      })
    }

    closeRegistrationOverlay(){
      this.setState({
        registrationOverlayVisible: false
      })
    }

  handleRegistrationRequest(navigation){
    const {navigate} = navigation;

    navigate('Landing')

  }

    openLikersOverlay(){
      this.setState({
        likersOverlayVisible: true
      })
    }

    closeLikersOverlay(){
      this.setState({
        likersOverlayVisible: false
      })
    }

    retrieveUploaderProfile(){
      const {navigate} = this.props.navigation;

      var id = this.state.mediaItem.profile_id;
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;

      axios.get(`http://nuv-api.herokuapp.com/profiles/${id}`,

    { headers: { Authorization: `${token}` }})

    .then(function(response){

     var uploaderProfile = JSON.parse(response.request['_response'])
     console.log("Uploader: ", uploaderProfile);

     navigate('UserView',
     {notMyProfile: true,
        uploader: uploaderProfile,
        token: self.props.navigation.getParam('token', 'NO-ID'),
        avatar:        self.props.navigation.getParam('avatar', 'NO-ID'),
        id:            self.props.navigation.getParam('id', 'NO-ID'),
        name:          self.props.navigation.getParam('name', 'NO-ID'),
        bio:           self.props.navigation.getParam('bio', 'NO-ID'),
        location:      self.props.navigation.getParam('location', 'NO-ID'),
        user_is_vegan: self.props.navigation.getParam('user_is_vegan', 'NO-ID'),
        current_user_id: self.props.navigation.getParam('current_user_id', 'NO-ID'),
      })

    }).catch(function(error){
     console.log("Error: ", error);
    })
    }

  onStarRatingPress(rating) {
  this.setState({
    starCount: rating
  });
  }

  checkFavouriteStatus(viewedMediaItem) {
    try {
      AsyncStorage.getItem('media_item_favourites').then((media) => {
        const items = media ? JSON.parse(media) : [];

        if (items.length > 0){
          var names = items.map((item) => items.name);

          if (names.includes(viewedFavourite)){
            this.setState({viewedItemAlreadyFavourite: true}, function(){
              console.log("Already favourite");
            });
          }
          else {
            this.setState({viewedItemAlreadyFavourite: false},
            function(){
              console.log("Not already favourite");
            });
          }
        }
        else {
          this.setState({viewedItemAlreadyFavourite: false}, function(){
            console.log("Not already favourite");
          });
        }
      }
    )
    }
      catch (error) {
        console.log(error);
    }
    }

  addMediaItemToFavourites = async() => {

    console.log("ITEM", JSON.stringify(this.props.navigation.getParam('title', 'Does not exist')));

    var self = this;

    var media_item = {title: this.state.mediaItem.title, url: this.state.mediaItem.url, user_image: this.state.mediaItem.user_image ? this.state.mediaItem.user_image : null, source: this.state.mediaItem.source ? this.state.mediaItem.source : null, user: this.state.mediaItem.user ? this.state.mediaItem.user : null, description: this.state.mediaItem.description}

    try {
      AsyncStorage.getItem('media_item_favourites').then((media_items) => {
        const items = media_items ? JSON.parse(media_items) : [];
        if (items.length > 0){
          var names = items.map((item) => item.title);
          if (!names.includes(media_item.title)){
          items.push(media_item);
          AsyncStorage.setItem('media_item_favourites', JSON.stringify(items));
          this.setState({newFavouriteAdded: true}, function(){
            Alert.alert(
                   `${media_item.title} was added to your favourites!`
                )
        })
      }
        else {
          Alert.alert(
                 `${media_item.title} is already in your favourites!`
              )
        }
    }
        else {
          items.push(media_item);
          AsyncStorage.setItem('media_item_favourites', JSON.stringify(items));
          Alert.alert(
                 `${media_item.title} was added to your favourites!`
              )
        }
        console.log("ITEMS AFTER", items);
  })}
    catch (error) {
      console.log(error);
    }

}

    postLike(navigation){
      var self = this;

      if (self.state.mediaItem.user_id){
      const {navigate} = navigation

        var token = navigation.getParam('token', 'NO-ID');
        var id = this.state.mediaItem.id
        var self = this;

      axios.post(`http://nuv-api.herokuapp.com/media/${id}/like`,  {"data": ""},

    { headers: { Authorization: `${token}` }})

    .then(function(response){

      var likes = self.state.mediaItem.likes += 1;
      var currentUser = [{
                  name: navigation.getParam('name', 'NO-ID'),
                  thumbnail: navigation.getParam('avatar', 'NO-ID'),
                  profile_id: navigation.getParam('id', 'NO-ID')
                }]
      var likers = self.state.likers.concat(currentUser)

      self.setState({
        likedItem: true,
        likes: likes,
        likers: likers
      }, function(){
        Alert.alert(
               `You now like '${this.state.mediaItem.title}'!`
            )

       console.log("Response from like post: ", response);
      })
     }
    )
    .catch(function(error){
     console.log("Error: ", error);
    })
  }
  else {
    Alert.alert(
           `This is not NüV proprietary content! You cannot like it.`
        )
    console.log("This item is not NüV proprietary content. Therefore we cannot save a like to the back end.");
  }
    }

    deleteLike(navigation){
      var self = this;

      if (self.state.mediaItem.user_id){
      const {navigate} = navigation

        var token = navigation.getParam('token', 'NO-ID');
        var id = this.state.mediaItem.id
        var self = this;

      axios.delete(`http://nuv-api.herokuapp.com/media/${id}/remove_like`,

    { headers: { Authorization: `${token}` }})

    .then(function(response){

      var likes = self.state.mediaItem.likes -= 1;
      var likers = self.state.likers.filter(liker => liker.profile_id != navigation.getParam('id', 'NO-ID'))

      self.setState({
        likedItem: false,
        likes: likes,
        likers: likers
      }, function(){
        Alert.alert(
               `You no longer like '${this.state.mediaItem.title}'!`
            )

       console.log("Response from like post: ", response);
      })
     }
    )
    .catch(function(error){
     console.log("Error: ", error);
    })
  }
  else {
    Alert.alert(
           `This is not NüV proprietary content! You cannot like it.`
        )
    console.log("This item is not NüV proprietary content. Therefore we cannot save a like to the back end.");
  }
    }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.mediaItem){
      var url = this.state.mediaItem.url
    }
    return (

      <View style={mediaViewStyle.container}>

      { this.state.mediaItem ? (


      <ScrollView style={{width: Dimensions.get('window').width*1, paddingLeft: Dimensions.get('window').width*0.015, paddingRight: Dimensions.get('window').width*0.015}} showsVerticalScrollIndicator={false}>

      <View style={mediaViewStyle.container}>

      <View style={{marginTop: Dimensions.get('window').height*0.02}}>
      </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FaveButton navigation={this.props.navigation} itemAlreadyLiked={this.state.mediaItem.already_liked} handleButtonClick={() => this.props.navigation.getParam('guest', 'NO-ID') === true ? this.openRegistrationOverlay() : this.addMediaItemToFavourites()}/>
          { this.state.mediaItem.id ? (

          <LikeButton
          navigation={this.props.navigation}
          itemAlreadyLiked={this.state.mediaItem.id
          && this.state.likedItem === true ? true : false}
          handleButtonClick={() => this.props.navigation.getParam('guest', 'NO-ID') === true ? this.openRegistrationOverlay() : this.state.likedItem === true ?
          this.deleteLike(this.props.navigation)
          : this.postLike(this.props.navigation)}
          />

        ) : null }
          <AddItemButton navigation={this.props.navigation}
          onPress={() => this.props.navigation.getParam('guest', 'NO-ID') === true ? this.openRegistrationOverlay() : navigate('MediaForm', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})} />
        </View>

        <Text style={mediaViewStyle.medianame}>
           {this.state.mediaItem.title}{"\n"}
        </Text>

          {
            this.state.mediaItem.id ? (
            <Text onPress={() => this.state.likers.length === 0 ? null : this.openLikersOverlay()} style={mediaViewStyle.medianame}>
            {this.state.likes} NüV {this.state.likes === 1 ? "user" : "users"} {this.state.likes === 1 ? "likes" : "like"} this ℹ︎ {"\n"}
            </Text>
            ) : null
          }

        <Text style={mediaViewStyle.mediareviewtitle}>
        This item was originally published by {this.state.mediaItem.source ? this.state.mediaItem.source : this.state.mediaItem.user}
        </Text>
    </View>

    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableHighlight underlayColor="white" onPress={()=> this.state.mediaItem.url ? Linking.openURL(this.state.mediaItem.url) :  Alert.alert(
               "No link available for this item"
            )}>
        <AutoHeightImage width={Dimensions.get('window').width*0.1} style={{ borderRadius: Dimensions.get('window').width*0.025, margin: Dimensions.get('window').width*0.025 }} source={require('../../assets/AppIcons/unlink.png')}/>
        </TouchableHighlight>
        { this.state.mediaItem.user_image ? (
        <TouchableHighlight underlayColor='white' onPress={() => this.retrieveUploaderProfile() }>
        <AutoHeightImage width={Dimensions.get('window').width*0.1} style={{ borderRadius: Dimensions.get('window').width*0.025, margin: Dimensions.get('window').width*0.025 }}
        source={this.state.mediaItem.user_image ? {uri: this.state.mediaItem.user_image} : require('../../assets/usericon.png')}
        />
        </TouchableHighlight>
      ) : null
    }
        <ShareButton
        marginLeft={Dimensions.get('window').width*0.07}
        shareOptions={{
        title: "Shared from NüV",
        message: `Hi, NüV user ${this.props.navigation.getParam('name', 'NO-ID')} thought you would like this article (${this.state.mediaItem.title}). Download NüV now to see more killer posts just like this!`,
        url: this.state.mediaItem.url,
        subject: "Message from NüV"
      }}
         />
    </View>

    <View >
      <View>
      { this.state.mediaItem.source || this.state.mediaItem.user ? (

        <Text style={mediaViewStyle.mediareviewtitle}>
        A brief description of this news item courtesy of {this.state.mediaItem.source ? this.state.mediaItem.source : `NüV user ${this.state.mediaItem.user}`}:{"\n"}
        </Text>

      ) : null

    }
        <Text style={mediaViewStyle.mediareviewbody}>
          {this.state.mediaItem.description}
        </Text>
      </View>
    </View>

    <View style={{alignItems: 'center', width: Dimensions.get('window').width*1}}>
    <Text style={mediaViewStyle.vibeHeading}>NuV user rating</Text>
    <StarRating
      disabled={false}
      maxStars={5}
      rating={this.state.starRating}
      fullStarColor={'#a2e444'}
      containerStyle={{marginBottom: Dimensions.get('window').height*0.02}}
      />
    </View>

        <View style={mediaViewStyle.submitContainer}>
        <GlobalButton
           buttonTitle="Home"
           onPress={() => navigate('Home', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})}/>
        </View>

      {  this.state.mediaItem.id ? (

        <LikersOverlay
              likers={this.state.likers}
              overlayVisible={this.state.likersOverlayVisible}
              closeOverlay={this.closeLikersOverlay}
              currentUser={this.props.navigation.getParam('id', 'NO-ID')}
              navigation={this.props.navigation}
        />

      ) : null }

      {this.state.registrationOverlayVisible ? (
      <GuestRegistrationOffer
      openOverlay    = {this.openRegistrationOverlay}
      handleRegistrationRequest   = {this.handleRegistrationRequest}
      navigation =                  {this.props.navigation}
      closeRegistrationOverlay   = {this.closeRegistrationOverlay}
      overlayVisible = {this.state.registrationOverlayVisible}
    />
    ) : null}

        </ScrollView>
      ) : <LoadingCelery /> }

        </View>
      );
      }
      }

const mediaViewStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height*0.03,
    marginBottom: Platform.OS === 'ios' ? Dimensions.get('window').height*0.05 : Dimensions.get('window').height*0.1
  },
  header: {
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },
  mediaitem: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
  },
  mediatextcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  medianame: {
    color: '#a2e444',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  mediareviewtitle: {
    color: '#a2e444',
    margin: 4,
    fontSize: 18,
  },
  mediareviewbody: {
    margin: 4,
    fontSize: 15,
  },

    profileItem: {
    padding: Dimensions.get('window').width* 0.025,
    fontSize: Dimensions.get('window').width>750 ? 24 : 16 ,
    color: 'black'
  },
  vibeHeading: {
  fontSize: Dimensions.get('window').width > 750 ? 27 : 20,
  textAlign: 'center',
  color: '#a2e444',
  marginTop: Dimensions.get('window').height*0.03
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height*0.03,
    marginBottom: Platform.OS === 'ios' ? Dimensions.get('window').height*0.15 : Dimensions.get('window').height*0.15
  },
  });
