import React from 'react';
import { StyleSheet, Alert, ScrollView, Platform, TouchableHighlight, Image, TextInput, Dimensions, Button, Text, View } from 'react-native';
import { Constants } from 'expo'
import GlobalButton from '../../components/GlobalButton.js';
import AddItemButton from '../../components/AddItemButton.js';
import FaveButton from '../../components/FaveButton.js';
import SmallTwoWayToggle from '../../components/SmallTwoWayToggle.js';
import LoadingCelery from '../../components/LoadingCelery.js';
import AutoHeightImage from 'react-native-auto-height-image';
import Expo, { ImagePicker } from 'expo';
import {Permissions} from 'expo';
import axios from 'axios';
import moment from 'moment';
import * as TimeGreeting from '../../helper_functions/TimeGreeting.js';
import * as ReverseArray from '../../helper_functions/ReverseArray.js';
import * as Badges from '../../helper_functions/Badges.js';

export default class NuVContributors extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle:(
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
 ),
}

    constructor(props) {
      super(props);

      this.changeToggleSelection = this.changeToggleSelection.bind(this);
      this.retrieveUploaderProfile = this.retrieveUploaderProfile.bind(this);
    }

    state = {
      seeOnlyVegan: false,
      contributorsLoading: true,
      loadingProfile: false
    }

    componentDidMount(){
      const {navigate} = this.props.navigation;
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;

      axios.get('http://nuv-api.herokuapp.com/all_users_contributions',

   { headers: { Authorization: `${token}` }})

   .then(function(response){

     var responseItems = JSON.parse(response.request['_response']);
     var contributors = responseItems.filter(contributor => contributor.total_contributions > 0)

     self.setState({
       contributors: contributors
     }, function(){
       self.setState({
         contributorsLoading: false
       })
     }
   )
 }).catch(function(error){
   console.log("Error: ", error);
 })
    }


    getActiveToggleIndex(){
      // return this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? 0 : 1
      return 1
    }

    changeToggleSelection(selection){

      this.setState({
        seeOnlyVegan: selection
      }, function(){
        console.log("See only vegan: ", this.state.seeOnlyVegan);
      })

    }

    returnStatus(status){
      if (status === "vegan"){
       return "Vegan";
      }
      else if (status === "vegetarian"){
       return "Vegetarian";
      }
      else {
       return "vCurious";
        }
      }

    mapContributors(){
      const {navigate} = this.props.navigation;
      var navigation = this.props.navigation;

      var contributorItems = this.state.seeOnlyVegan === true ? this.state.contributors.filter(contributor => contributor.profile && contributor.profile.user_is_vegan === "vegan" && contributor.profile.avatar.url) : this.state.contributors.filter(contributor => contributor.profile && contributor.profile.avatar.url)
      return contributorItems.map((item, i) =>

      <View key={i} style={venueListStyle.venueitem}>
        <View key={i+10} style={venueListStyle.venuetextcontainer}>
      <TouchableHighlight underlayColor={'white'}
        key={i+1}
        onPress={() => this.setState({loadingProfile: true}, function(){ this.retrieveUploaderProfile(item)})}>
        <AutoHeightImage key={i+2}
         width={50} style={{borderRadius: 25}}
         source={item.profile.avatar.url ? {uri: item.profile.avatar.url} : require('../../assets/usericon.png')}

 />
      </TouchableHighlight>
      </View>
          <View key={i+3} style={venueListStyle.venuetextcontainer}>
              <Text
              key={i+5}
              style={venueListStyle.venuetitle}
              onPress={() => this.setState({loadingProfile: true}, function(){ this.retrieveUploaderProfile(item)})}>
              {item.profile.name === this.props.navigation.getParam('name', 'NO-ID') ? "You" : item.profile.name}
              </Text>
          </View>
          <View key={i+13} style={venueListStyle.venuetextcontainer}>
        <TouchableHighlight underlayColor={'white'}
          key={i+15}
          onPress={() => this.setState({loadingProfile: true}, function(){ this.retrieveUploaderProfile(item)})}>
          <AutoHeightImage key={i+20} source={Badges.getDietBadge(this.returnStatus(item.profile.user_is_vegan))} width={50} style={{borderRadius: 25}}/>
        </TouchableHighlight>
        </View>
          <View key={i+7} style={venueListStyle.venuetextcontainer}>
              <Text
              key={i+8}
              style={venueListStyle.contributionCount}
              onPress={() => this.setState({loadingProfile: true}, function(){ this.retrieveUploaderProfile(item)})}>
              {item.total_contributions} {item.total_contributions === 1 ? 'post' : 'posts'}
              </Text>
          </View>
        </View>
      )
    }

    retrieveUploaderProfile(contributor){

      const {navigate} = this.props.navigation;
      var navigation = this.props.navigation;

      var id = contributor.profile.id;
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;

      axios.get(`http://nuv-api.herokuapp.com/profiles/${id}`,

   { headers: { Authorization: `${token}` }})

   .then(function(response){

     var uploaderProfile = JSON.parse(response.request['_response'])

     self.setState({ loadingProfile: false},
       function(){
     navigate('UserView',
     {notMyProfile: true,
        uploader: uploaderProfile,
        guest: this.props.navigation.getParam('guest', 'NO-ID'),
        fromContributorsPage: true,
        current_user_id: navigation.getParam('current_user_id', 'NO-ID'),
        token: this.props.navigation.getParam('token', 'NO-ID'),
        brands: !contributor.brands_cont_count ? 0 : contributor.brands_cont_count,
        media: !contributor.media_cont_count ? 0 : contributor.media_cont_count,
        venues: !contributor.venues_cont_count ? 0 : contributor.venues_cont_count,
        recipes: !contributor.recipes_cont_count ? 0 : contributor.recipes_cont_count
      })
    }
    )

   }).catch(function(error){
     console.log("Error: ", error);
   })
    }

    render() {
      const {navigate} = this.props.navigation;

      if (this.state.contributorsLoading === false && this.state.loadingProfile === false){
      return (

    <View style={venueListStyle.container}>

    <ScrollView style={{width: Dimensions.get('window').width*0.95}} showsVerticalScrollIndicator={false}>
    <View style={[venueListStyle.container, {marginBottom: Dimensions.get('window').height*0.06}]}>


    <View style={{marginTop: Dimensions.get('window').height*0.02}}>
    </View>

      <View style={{flex: 1, flexDirection: 'row'}}>
        <SmallTwoWayToggle onContributorsPage={true} changeToggleSelection={this.changeToggleSelection} activeIndex={this.getActiveToggleIndex()} />
        {/*<FaveButton navigation={this.props.navigation}/>*/}
      </View>

      <AutoHeightImage
          width={70}
          source={require('../../assets/icon.png')}
          style={{marginBottom: Dimensions.get('window').height*0.04, marginTop: 5}}
      />

          <View style={{height: 35, alignItems: 'center'}}>
          <Text style={{fontSize: Dimensions.get('window').width > 750 ? 24 : 18, textAlign: 'center'}}>
              Meet our community
          </Text>
          </View>

      </View>
      </ScrollView>

    <ScrollView style={{width: Dimensions.get('window').width*0.95, marginTop: Dimensions.get('window').height*0.01}} showsVerticalScrollIndicator={false}>
    <View style={venueListStyle.innerContainer}>

      <View style={{marginTop: Dimensions.get('window').height*0.04}}>
      </View>

      {this.state.contributors && this.state.contributors.length > 0 ? (
        this.mapContributors()
      ): null
    }

    {this.state.contributors && this.state.contributors.length == 0 && this.props.navigation.getParam('user', 'NO-ID') === true ? (
      <Text style={{fontSize: Dimensions.get('window').width > 750 ? 24 : 18, textAlign: 'center', marginBottom: Dimensions.get('window').height*0.02}}> No contributors to show </Text>

    ): null
  }

    </View>
  </ScrollView>
</View>
)
}
  else {
    return (

      <View style={{backgroundColor: '#FBFEFC'}}>
      <LoadingCelery />
      </View>

    )
  }
}
}

const venueListStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Dimensions.get('window').height*0.6
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height*0.03,
    marginBottom: Platform.OS === 'ios' ? Dimensions.get('window').height*0.05 : Dimensions.get('window').height*0.05
  },
  header: {
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },

  venueitem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  venuetextcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  venuetitle: {
    color: '#a2e444',
    margin: 4,
    fontSize: Dimensions.get('window').width > 750 ? 20 : 16,
    fontWeight: 'bold',
  },
  contributionCount: {
    color: 'black',
    margin: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  venuetype: {
    color: '#696969',
    margin: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
  venueaddress: {
    color: '#a2e444',
    margin: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  venuedescription: {
    margin: 4,
    fontSize: 15
  }
});
