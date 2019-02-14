import React from 'react';
import { StyleSheet, ScrollView, Platform, TouchableHighlight, Image, TextInput, Dimensions, Button, Text, View } from 'react-native';
import { Constants } from 'expo'
import GlobalButton from '../../components/GlobalButton.js';
import AddItemButton from '../../components/AddItemButton.js';
import FaveButton from '../../components/FaveButton.js';
import SmallTwoWayToggle from '../../components/SmallTwoWayToggle.js';
import LoadingCelery from '../../components/LoadingCelery.js';
import AutoHeightImage from 'react-native-auto-height-image';
import Expo, { ImagePicker } from 'expo';
import {Permissions} from 'expo'
import axios from 'axios';
import moment from 'moment';
import * as TimeGreeting from '../../helper_functions/TimeGreeting.js';
import * as ReverseArray from '../../helper_functions/ReverseArray.js';
import key from '../../news_key.js';

export default class MediaList extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle:(
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
 ),
}

    constructor(props) {
      super(props);

      this.changeToggleSelection = this.changeToggleSelection.bind(this);
    }

    state = {
      seeOnlyVegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? true : false,
      contentLoading: true
    }

    componentDidMount(){
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;
      var request_keyword = this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? "veganism" : "vegetarianism"
      console.log("Key", key);
      var url = `https://newsapi.org/v2/everything?q=veganism&apiKey=${key}`;

      axios.get(url)

   .then(function(response){


     var responseItems = response.data.articles
     var newsArray = []
     responseItems.forEach((item) => {
       mediaItem = {
         title: item.title,
         url: item.url,
         publishedAt: item.publishedAt,
         source: item.source.name,
         description: item.description,
         user_id: null,
         content_is_vegan: true
       }
       newsArray.push(mediaItem)
     })

     self.setState({
       mediaItems:  self.props.navigation.getParam('user', 'NO-ID') === true ? newsArray.filter(mediaItem => mediaItem.user_id === self.props.navigation.getParam('user_id', 'NO-ID')) : newsArray
     },
     function(){
       self.fetchVegetarianStories()
     }
   )
 }).catch(function(error){
   console.log("Error: ", error);
 })
    }

    fetchVegetarianStories(){

      var self = this;
      var url = `https://newsapi.org/v2/everything?q=vegetarianism&apiKey=${key}`;

      axios.get(url)

   .then(function(response){


     var responseItems = response.data.articles
     var newsArray = []
     responseItems.forEach((item) => {
       mediaItem = {
         title: item.title,
         url: item.url,
         publishedAt: item.publishedAt,
         source: item.source.name,
         description: item.description,
         user_id: null,
         content_is_vegan: false
       }
       newsArray.push(mediaItem)
     })

     var filteredNewsArray = self.props.navigation.getParam('user', 'NO-ID') === true ? newsArray.filter(mediaItem => mediaItem.user_id === self.props.navigation.getParam('user_id', 'NO-ID')) : newsArray
     var updatedState = filteredNewsArray.concat(self.state.mediaItems);

     self.setState({
       mediaItems: updatedState
     },
     function(){
       self.fetchNuvApiStories()
     }
   )
 }).catch(function(error){
   console.log("Error: ", error);
 })

    }

    fetchNuvApiStories(){
      var token = this.props.navigation.getParam('token', 'NO-ID');
    var self = this;

    axios.get('http://nuv-api.herokuapp.com/media',

 { headers: { Authorization: `${token}` }})

 .then(function(response){

   var responseItems = JSON.parse(response.request['_response'])

   var newsArray = []
   responseItems.forEach((item) => {
     mediaItem = {
       title: item.title,
       url: item.url,
       publishedAt: item.created_at,
       source: `${item.user_name} (NüV)`,
       description: item.description,
       user_id: item.user_id,
       content_is_vegan: item.content_is_vegan
     }
     newsArray.push(mediaItem)
   })

   var mediaItems = ReverseArray.reverseArray(newsArray);
   var filteredMediaItems = self.props.navigation.getParam('user', 'NO-ID') === true ? mediaItems.filter(mediaItem => mediaItem.user_id === self.props.navigation.getParam('user_id', 'NO-ID')) : mediaItems

   var updatedState = self.state.mediaItems.concat(filteredMediaItems)
   self.setState({
     mediaItems:  updatedState
   },
   function(){
     self.setState({
       contentLoading: false
     })
   }
 )
}).catch(function(error){
 console.log("Error: ", error);
})
}

    getActiveToggleIndex(){
      return this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? 0 : 1
    }

    changeToggleSelection(selection){

      this.setState({
        seeOnlyVegan: selection
      }, function(){
        console.log("See only vegan: ", this.state.seeOnlyVegan);
      })

    }

    returnMessage(){
      if (this.props.navigation.getParam('user', 'NO-ID') === true ){
        return `Here are your media contributions.`
      }
      else {
        return "Here is the news."
      }
    }

    mapMediaItems(){
      const {navigate} = this.props.navigation;

      var mediaItems = this.state.seeOnlyVegan === true ? this.state.mediaItems.filter(mediaItem => mediaItem.content_is_vegan === true) : this.state.mediaItems

      return mediaItems.map((item, i) =>

        <View style={mediaListStyle.mediaitem}   key={i}>
        <TouchableHighlight  key={i+6} onPress={() => navigate('MediaItemView', {token: this.props.navigation.getParam('token', 'NO-ID'), id: item.id, title: item.title, description: item.description})}  style={mediaListStyle.mediadescription} style={mediaListStyle.mediaimage}>
          <Image source={require('../../assets/AppIcons/greennews.png')} style={{height: 80, width: 80}}/>
        </TouchableHighlight>
            <View  key={i+2} style={mediaListStyle.mediatextcontainer}>
              <View  key={i+1}>
                <Text  key={i+3} onPress={() => navigate('MediaItemView', {token: this.props.navigation.getParam('token', 'NO-ID'), id: item.id, title: item.title, description: item.description})}  style={mediaListStyle.mediadescription}  style={mediaListStyle.mediatitle}>
                {item.title}
                </Text>
              </View>
              <View  key={i+4}>
                <Text  key={i+5} onPress={() => navigate('MediaItemView', {token: this.props.navigation.getParam('token', 'NO-ID'), id: item.id, title: item.title, description: item.description})}  style={mediaListStyle.mediadescription}>
                {item.description}
                </Text>
              </View>
              <View  key={i+7}>
                <Text  key={i+8} onPress={() => navigate('MediaItemView', {token: this.props.navigation.getParam('token', 'NO-ID'), id: item.id, title: item.title, description: item.description})}  style={mediaListStyle.mediadescription}  style={mediaListStyle.mediatitle}>
                {moment(new Date(item.publishedAt), 'MMMM Do YYYY, h:mm:ss a').calendar()} - {item.source}
                </Text>
              </View>
            </View>
          </View>
      )
    }

    render() {
      const {navigate} = this.props.navigation;
      return (

    <View style={mediaListStyle.container}>

    { this.state.contentLoading === false ? (

    <ScrollView style={{width: Dimensions.get('window').width*0.95}} showsVerticalScrollIndicator={false}>
    <View style={mediaListStyle.container}>

    <View style={{marginTop: Dimensions.get('window').height*0.02}}>
    </View>

      <View style={{flex: 1, flexDirection: 'row'}}>
        <SmallTwoWayToggle changeToggleSelection={this.changeToggleSelection} activeIndex={this.getActiveToggleIndex()} />
        <AddItemButton navigation={this.props.navigation}
        onPress={() => navigate('MediaForm', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})} />
        {/*<FaveButton navigation={this.props.navigation}/>*/}
      </View>

      <AutoHeightImage
          width={70}
          source={require('../../assets/AppIcons/newspaper.png')}
          style={{marginBottom: Dimensions.get('window').height*0.04, marginTop: 5}}
      />

      <Text style={{fontSize: 18, textAlign: 'center'}}>
          {TimeGreeting.getTimeBasedGreeting(this.props.navigation.getParam('name', 'NO-ID'))}{"\n"} {this.returnMessage()}
      </Text>

      <View style={{marginTop: Dimensions.get('window').height*0.04}}>
      </View>

      {
        this.state.mediaItems && this.state.mediaItems.length > 0 ? (

      this.mapMediaItems()

    ) :   null
  }

  {
    this.state.mediaItems && this.state.mediaItems.length === 0 && this.props.navigation.getParam('user', 'NO-ID') === true ? (

      <Text style={{fontSize: Dimensions.get('window').width > 750 ? 24 : 20, marginBottom: Dimensions.get('window').height*0.02}}> You have not uploaded any media items yet. </Text>


) :   null
}

      <View>
        <GlobalButton
          buttonTitle="Home"
          onPress={() => navigate('Home', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})}/>
      </View>
    </View>
  </ScrollView>

) : <LoadingCelery />

}

</View>

)

}
}

const mediaListStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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


  mediaitem: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
  },
  mediatextcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mediatitle: {
    color: '#a2e444',
    margin: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mediadescription: {
    margin: 4,
    fontSize: 15
  }
});
