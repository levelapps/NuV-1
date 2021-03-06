
import React, { Component, Fragment } from 'react'
import { Button }    from 'react-native-elements';
import { View,
         Dimensions,
         TouchableHighlight,
         StyleSheet, Text } from 'react-native';
import GradientButton from './GradientButton.js';
import GlobalButton from './GlobalButton.js';
import Overlay from 'react-native-modal-overlay'
import Slider from 'react-native-slider';
import MapSettingsTwoWayToggle from './MapSettingsTwoWayToggle.js';
import AutoHeightImage from 'react-native-auto-height-image';
import axios from 'axios';

export default class LikersOverlay extends Component {

  constructor(props) {
  super(props);

  }

  state = {
    };


  mapLikers(){
    return this.props.likers.map((liker, i) =>
    <View key={i} style={addItemOverlayStyle.iconsContainer}>

    <TouchableHighlight onPress={() => this.retrieveUploaderProfile(liker.profile_id)} underlayColor={'white'}>
    <AutoHeightImage
      key={i+2}
      width={Dimensions.get('window').width*0.15}
      style={{ borderRadius: Dimensions.get('window').width*0.025 }}
      source={{uri: liker.thumbnail}}/>
    </TouchableHighlight>

      <Text
      onPress={() => this.retrieveUploaderProfile(liker.profile_id)}
      key={i+1}
      style={{fontSize: Dimensions.get('window').width > 750 ? 19 : 16,
      marginLeft: Dimensions.get('window').width*0.05}}>
      {liker.profile_id === this.props.currentUser ? 'You' : liker.name}
      </Text>

      </View>
    )
  }

  retrieveUploaderProfile(id){

    this.props.closeOverlay()

    var {navigate} = this.props.navigation;

    var id = id;
    var token = this.props.navigation.getParam('token', 'NO-ID');
    var self = this;

    axios.get(`http://nuv-api.herokuapp.com/profiles/${id}`,

 { headers: { Authorization: `${token}` }})

 .then(function(response){

   var uploaderProfile = JSON.parse(response.request['_response'])

   console.log("Uploader profile details: ", uploaderProfile);

   navigate('UserView',
   {notMyProfile: true,
      uploader: uploaderProfile
    })

 }).catch(function(error){
   console.log("Error: ", error);
 })
  }


render() {

  return (
    <View style={{  alignItems: 'center', justifyContent: 'center', marginTop: Dimensions.get('window').height*0.001 }}>

    <Overlay visible={this.props.overlayVisible} onClose={this.props.closeOverlay} closeOnTouchOutside
    animationType="fadeInUp" containerStyle={{backgroundColor: 'rgba(0,0,0,0.8)'}}
    childrenWrapperStyle={{backgroundColor: 'white', borderRadius: 15}}
    animationDuration={500}>
    {
      (hideModal, overlayState) => (
        <Fragment>

        <Text style={{
          textAlign: 'center',
          fontSize: Dimensions.get('window').width > 750 ? 22 : 18,
          fontWeight: 'bold',
          color: '#696969',
          marginTop: Dimensions.get('window').height*0.03,
          marginBottom: Dimensions.get('window').height*0.015}}
        >
          NüV users who like this
        </Text>

        {this.mapLikers()}

        </Fragment>
      )
    }
  </Overlay>

        </View>
    )
  }
}

const addItemOverlayStyle = StyleSheet.create({
  iconsContainer: {
    marginLeft: 0,
    marginTop: Dimensions.get('window').height*0.025,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
