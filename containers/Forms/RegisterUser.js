import React from 'react';
import { StyleSheet, AsyncStorage, ImageBackground, ImageEditor, Alert, ScrollView, Platform, TouchableHighlight, Image, TextInput, Dimensions, Button, Text, View } from 'react-native';
import { Constants } from 'expo'
import GlobalButton from '../../components/GlobalButton.js';
import VWayToggle from '../../components/VWayToggle.js';
import AutoHeightImage from 'react-native-auto-height-image';
import Expo, { ImagePicker } from 'expo';
import {Permissions} from 'expo'
import axios from 'axios';
import SubmittedFormSpinner from '../../components/SubmittedFormSpinner.js';
import ImageManipulator from '../../components/ImageManipulator.js';
import * as ValidateEmail from '../../helper_functions/ValidateEmail.js';
import * as ValidatePassword from '../../helper_functions/ValidatePassword.js';

export default class RegisterUser extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle: (
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
 ),
}

  constructor(props) {
  super(props);

  this.changeEmailText = this.changeEmailText.bind(this);
  this.changePasswordText = this.changePasswordText.bind(this);
  this.changeNameText = this.changeNameText.bind(this);
  this.changeLocationText = this.changeLocationText.bind(this);
  this.changeBioText = this.changeBioText.bind(this);
  this.pickImage = this.pickImage.bind(this);
  this.returnVToggleSelection = this.returnVToggleSelection.bind(this);
  this.emailFeedback = this.emailFeedback.bind(this);
  this.passwordFeedback = this.passwordFeedback.bind(this);
  this.passwordMatchChecker = this.passwordMatchChecker.bind(this);
  this.fieldCompletionCheck = this.fieldCompletionCheck.bind(this);
  this.processRegistration = this.processRegistration.bind(this);
  this.postData = this.postData.bind(this);
  this.onToggleModal = this.onToggleModal.bind(this);

}

  state = {
      email: "",
      password: "",
      password2: "",
      name: "",
      location: "",
      bio: "",
      image: null,
      vSelection: "vegetarian",
      sentPhotoWarning: false,
      spinner: false,
      cropperVisible: false
    };

    componentDidMount(){
      this.setState({
        navigation: this.props.navigation
      })
    }

    storeLogInCredentials = async(response, token) => {

      var self = this;
      var {navigate} = this.props.navigation;
      var responseForName = response;
      var uri = responseForName.avatar ? responseForName.avatar.url : null
      var token = token;

      var credentials = {email: this.state.email, password: this.state.password}

      try {
        AsyncStorage.getItem('me').then((me) => {
          const myDetails = me ? JSON.parse(me) : [];
          if (myDetails.length === 0){
            myDetails.push(credentials);
            AsyncStorage.setItem('me', JSON.stringify(myDetails));
        }
        if (self.state.image && Platform.OS == 'ios'){
        navigate('CropperHoldingPage', {registering: true, height: self.state.height, width: self.state.width, user_id: responseForName.user_id, avatar: uri, token: token, id: responseForName.id, name: responseForName.name, bio: responseForName.bio, user_is_vegan: responseForName.user_is_vegan, location: responseForName.location})
      }
      else {
        navigate('Home', {user_id: responseForName.user_id, avatar: uri, token: token, id: responseForName.id, name: responseForName.name, bio: responseForName.bio, user_is_vegan: responseForName.user_is_vegan, location: responseForName.location})
      }
    })}
      catch (error) {
        Alert.alert(
               "Could not complete the login process"
            )
      }
  }

    fieldCompletionCheck(){
      if (this.state.email === ""){
        Alert.alert(
              "Please enter an email address"
            )
            return;
      }
      if (ValidateEmail.validateEmail(this.state.email) === false) {
        Alert.alert(
              "Please enter a valid email address"
            )
            return;
      }
      if (this.state.password === ""){
        Alert.alert(
              "Please enter a password"
            )
            return;
      }
      if (this.state.password2 === ""){
        Alert.alert(
              "Please fill in both password fields"
            )
            return;
      }
      if (ValidatePassword.validatePassword(this.state.password) === false) {
        Alert.alert(
              "Please enter a valid password"
            )
            return;
      }
      if (this.state.password != this.state.password2){
        Alert.alert(
              "Your passwords need to match"
            )
            return;
      }
      // if (this.state.name === ""){
      //   Alert.alert(
      //         "Please enter a username"
      //       )
      //      return;
      // }
      if (this.state.name.length > 11 && this.state.name != ""){
        Alert.alert(
              "Your NüV name must be shorter than 12 characters"
            )
           return;
      }
      // if (this.state.location === ""){
      //   Alert.alert(
      //         "Please enter a hometown"
      //       )
      //     return;
      // }
      if (this.state.bio === ""){
        Alert.alert(
              "Please enter a bio"
            )
          return;
      }
      if (this.state.sentPhotoWarning === false){
      if (!this.state.image){
        Alert.alert(
              "You have not uploaded a profile picture. Add one or tap 'Submit' to proceed without one"
            )
            this.setState({ sentPhotoWarning: true })
          return;
      }
      else {
        console.log("Form completed.");
        return "Complete"
      }
    }
    else {
      return "Complete"
    }
    }

    emailFeedback(){
      if (ValidateEmail.validateEmail(this.state.email) === true){
        this.setState({
          emailTextColor: '#0dc6b5'
        })
      }
      else {
        this.setState({
          emailTextColor: 'crimson'
        })
      }
    }

    passwordFeedback(){
      if (ValidatePassword.validatePassword(this.state.password) === true){
        this.setState({
          passwordTextColor: '#0dc6b5',
          firstPasswordError: false
        })
      }
      else {
        this.setState({
          passwordTextColor: 'crimson',
          firstPasswordError: true
        })
      }
    }

    passwordMatchChecker(){
      if (this.state.password != this.state.password2){
            this.setState({
              passwordTextColor: 'crimson',
              password2TextColor: 'crimson',
              passwordMismatch: true
            })
      }
      else {
        this.setState({
          password2TextColor: '#0dc6b5',
          passwordTextColor: '#0dc6b5',
          firstPasswordError: false,
          passwordMismatch: false
        })
      }
    }

    onToggleModal() {
      this.setState({ cropperVisible: !this.state.cropperVisible })

    }

    changeEmailText(email){
      this.setState({
        email: email
      })
    }

    changeNameText(name){
      this.setState({
        name: name
      })
    }

    changeLocationText(location){
      this.setState({
        location: location
      })
    }

    changePasswordText(password){
      this.setState({
        password: password
      })
    }

    changePassword2Text(password){
      this.setState({
        password2: password
      })
    }

    changeBioText(bio){
      this.setState({
        bio: bio
      })
    }

    processRegistration(){
      if (this.fieldCompletionCheck() === "Complete"){
      this.setState({
        processingRegistration: true,
        spinner: true
      },
    function(){
      this.postData();
    })
    }
  }

    getButtonMessage(){
      if (this.state.processingRegistration === true){
        return "Processing..."
      }
      else {
        return "Submit"
      }
    }

    postData(){
      if (this.fieldCompletionCheck() != "Complete"){
        return;
      }

      else {

      var session_url = 'http://nuv-api.herokuapp.com/signup';
      var {navigate} = this.props.navigation;
      var self = this;

      if (this.state.image != null){
      var uriParts = this.state.image.split('.');
      var fileType = uriParts[uriParts.length - 1];
    }

      axios.post(session_url, {"user":
  	{
      "email": this.state.email.trim(),
      "password": this.state.password.trim()
    }
    }
  ).then(function(response) {
        axios.post(`http://nuv-api.herokuapp.com/login`, {"user":
    	{
        "email": self.state.email.trim(),
        "password": self.state.password.trim()
      }
      }).then(function(second_response) {
        var token = second_response.headers.authorization;
        const formData = new FormData();
       formData.append('profile[name]', self.state.name === "" ? "NüV visitor" : self.state.name.trim());
       formData.append('profile[bio]', self.state.bio);
       formData.append('profile[user_is_vegan]', self.state.vSelection);
       formData.append('profile[location]', self.state.location === "" ? "Undisclosed" : self.state.location);
       if (self.state.image != null){
       formData.append('profile[avatar]', {
        uri: self.state.image,
       name: `${Date.now()}.${fileType}`,
       type: `image/${fileType}`,
      })
    };

         axios.post('http://nuv-api.herokuapp.com/profiles',
        formData,
      { headers: { Authorization: `${token}`, 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' }})
      .then(function(third_response){
        axios.get('http://nuv-api.herokuapp.com/this_users_profile',
       { headers: { Authorization: `${token}` }})
       .then(function(fourth_response){
         var responseForName = JSON.parse(fourth_response.request['_response'])
         var uri = responseForName.avatar ? responseForName.avatar.url : null

        self.setState({

          spinner: false

        }, function(){
          self.storeLogInCredentials(responseForName, token)
          })
          })
        })
      })
    }).catch(function(e){
          console.log(e);
        })

      }
    }

    returnVToggleSelection(selection){
      this.setState({
        vSelection: selection
      })
    }

    returnVeganSelectionForPost(){
      if (this.state.vSelection === "vegan"){
        return "vegan";
      }
      else if (this.state.vSelection === "vegetarian") {
        return "vegetarian";
      }
      else {
        return null;
      }
    }

    pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

     let result = await ImagePicker.launchImageLibraryAsync({
       allowsEditing: true,
       mediaTypes: ImagePicker.MediaTypeOptions.All,
       quality: 0.5, //NB: Set at 0.5 to reduce file size for DB
       exif: false,  //NB: Set to false to reduce file sive for DB
       aspect: [1, 1]
     });

     console.log(result);

     if (!result.cancelled) {
       this.setState({
         image: result.uri,
         width: result.width,
         height: result.height
       });
     }
   };


  render() {
    const {navigate} = this.props.navigation;

    var image = this.state.image


    return (

      <View style={registerUserStyle.container}>

      <SubmittedFormSpinner spinner={this.state.spinner} />

      <ScrollView style={{width: Dimensions.get('window').width*0.95}} showsVerticalScrollIndicator={false}>
      <View style={registerUserStyle.container}>

      <View style={registerUserStyle.descriptionContainer}>
          <Text style={registerUserStyle.descriptionText}>
              Join our community: find & share brilliant brands, well researched recipes, awesome articles & ethical eateries{"\n"}{"\n"}
              This is just the veganing
          </Text>
      </View>

          <TextInput
            style={{color: this.state.emailTextColor, marginTop: Dimensions.get('window').height*0.05, borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(email) => {this.changeEmailText(email)}}
            value={this.state.email} placeholder='Email address' placeholderTextColor='black'
            underlineColorAndroid='transparent' onEndEditing={this.emailFeedback}
          />

          <TextInput
            style={{color: this.state.passwordTextColor, borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(password) => {this.changePasswordText(password)}}
            value={this.state.password} placeholder='Password' placeholderTextColor='black'
            underlineColorAndroid='transparent' onEndEditing={this.passwordFeedback}
            secureTextEntry={true}
          />

          {
            this.state.firstPasswordError ? (

          <Text style={{fontSize: 15, textAlign: 'center', padding: 20, flexWrap: 'wrap' }}>Your password must be more than 8 characters long and should contain at least one upper case letter, one lower case letter and at least one number.</Text>

        ) : null
      }

          <TextInput
            style={{color: this.state.password2TextColor, borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(password) => {this.changePassword2Text(password)}}
            value={this.state.password2} placeholder='Confirm password' placeholderTextColor='black'
            underlineColorAndroid='transparent' onEndEditing={this.passwordMatchChecker}
            secureTextEntry={true}
          />

          {
            this.state.passwordMismatch ? (

          <Text style={{fontSize: 15, textAlign: 'center', padding: 20, flexWrap: 'wrap' }}>Your passwords need to match. Please review fields.</Text>

        ) : null
      }

          <TextInput
            style={{borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(name) => {this.changeNameText(name)}}
            value={this.state.name} placeholder='Name' placeholderTextColor='black'
            underlineColorAndroid='transparent' maxLength={14}
          />

          <TextInput
            style={{borderBottomColor: 'grey', width: Dimensions.get('window').width*0.5, height: 40, marginBottom: Dimensions.get('window').height*0.04, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(location) => {this.changeLocationText(location)}}
            value={this.state.location} placeholder='Town/City' placeholderTextColor='black'
            underlineColorAndroid='transparent'
          />

          <VWayToggle returnVToggleSelection={this.returnVToggleSelection}  />

          <TextInput
            style={{marginTop: Dimensions.get('window').height*0.03, borderWidth: 1, borderColor: 'grey', width: Dimensions.get('window').width*0.75, height: 100, marginBottom: Dimensions.get('window').height*0.04, textAlign: 'center', fontWeight: 'normal', fontSize: 15}}
            onChangeText={(bio) => {this.changeBioText(bio)}}
            value={this.state.bio} placeholder='Tell us about yourself' placeholderTextColor='black'
            underlineColorAndroid='transparent' maxLength={500} multiline={true}
          />

          <GlobalButton
             buttonTitle="Profile pic"
             onPress={() => this.pickImage()}/>

        {this.state.image &&
          <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width >750 ? this.state.width/3 : this.state.width/5, height: Dimensions.get('window').width > 750 ? this.state.height/3 : this.state.height/5, marginTop: Dimensions.get('window').height*0.05, marginBottom: Dimensions.get('window').height*0.05 }} />
        }

          <View style={registerUserStyle.submitContainer}>
          <GlobalButton
             buttonTitle={this.getButtonMessage()}
              onPress={() => this.processRegistration()}/>
          </View>

          </View>

          </ScrollView>

      </View>
    );
  }
}

const registerUserStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height*0.03,
    marginBottom: Platform.OS === 'ios' ? Dimensions.get('window').height*0.6 : Dimensions.get('window').height*0.6
  },
  header: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },
  descriptionText: {
    marginTop: Dimensions.get('window').height*0.03,
    paddingLeft: Dimensions.get('window').width*0.005,
    paddingRight: Dimensions.get('window').width*0.005,
    textAlign: 'center',
    fontSize: Dimensions.get('window').width < 750 ? 16 : 18,
    color: '#696969',
  },
});
