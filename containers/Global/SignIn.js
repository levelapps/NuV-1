import React from 'react';
import { StyleSheet, Platform, TextInput, Image, Dimensions, Text, View } from 'react-native';
import { Constants } from 'expo'
import GlobalButton from '../../components/GlobalButton.js';
import AutoHeightImage from 'react-native-auto-height-image';
import axios from 'axios';

export default class SignIn extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle: (
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/AppIcons/transparentlogo.png')}/>
 ),
}

  constructor(props) {
  super(props);

  this.changeEmailText = this.changeEmailText.bind(this);
  this.changePasswordText = this.changePasswordText.bind(this);

}

  state = {
      email: "",
      password: ""
    };

    changeEmailText(email){
      this.setState({
        email: email
      })
    }

    changePasswordText(password){
      this.setState({
        password: password
      })
    }

  postData(){

    var session_url = 'http://localhost:3000/login';
    var {navigate} = this.props.navigation;

    var self = this;

    axios.post(session_url, {"user":
	{
    "email": this.state.email,
    "password": this.state.password
  }
  }
).then(function(response) {
      console.log('response:', response);
      console.log('Obtained token. (PROFILE)');
      navigate('Home', {name: 'SignIn'})
      var token = response.data['token']
      axios.post(`http://localhost:8080/social_reach/auth-jwt-verify/`,  {
          "token": token,
          'username': self.state.activation_user['username'],
          'password': self.state.password
        }).then(function(second_response) {
          console.log(response);
        console.log('Authenticated');
        var token = response.data['access']
      console.log(picture_one);
      var create_profile_url = 'http://localhost:8080/social_reach/profiles/'

      const formData = new FormData();
      formData.append('picture', picture_one);

      axios.post(create_profile_url, formData).then(()=>{
        console.log("Done");
          self.props.handleLoginFromRegistrationSubmit( self.state.activation_user['username'], self.state.password)
        })
      })}).catch(function(e){
        console.log(e);
      })

  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={signInStyle.container}>

          <TextInput
            style={{marginTop: Dimensions.get('window').height*0.15, borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(email) => {this.changeEmailText(email)}}
            value={this.state.email} placeholder='Email address' placeholderTextColor='black'
            underlineColorAndroid='transparent' underlineColorIOS="grey"
          />


         <TextInput
           style={{borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
           onChangeText={(password) => {this.changePasswordText(password)}}
           value={this.state.password} placeholder='Password' placeholderTextColor='black'
           underlineColorAndroid='transparent'
         />

         <View style={signInStyle.submitContainer}>
         <GlobalButton buttonTitle="Sign in" onPress={() => this.postData()} />
         </View>

      </View>
    );
  }
}

const signInStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContainer: {
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },
});
