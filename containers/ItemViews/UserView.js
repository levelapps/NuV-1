import React from 'react';
import { StyleSheet, Dimensions, Button, Text, View } from 'react-native';
import { Constants } from 'expo';
import * as TimeGreeting from '../../helper_functions/TimeGreeting.js';
import NavBar from '../../components/NavBar.js';

export default class UserView extends React.Component {
  static navigationOptions = {
      header: null,

  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={userViewStyle.container}>
      <Text style={userViewStyle.header}>NüV - Lifestyle support</Text>
      <View style={userViewStyle.buttonContainer}>
        <Text style={{fontSize: 18, color: 'midnightblue'}}> {TimeGreeting.getTimeBasedGreeting("Jarrod")} </Text>
        <Text style={{fontSize: 18, color: 'midnightblue'}}> This is your private profile. Only you can see your profile as it appears here.</Text>
      </View>
      <Button
        title="Go home"
        onPress={() => navigate('Home', {name: 'SignIn'})}
      />
      <NavBar navigation={this.props.navigation} />
      </View>
    );
  }
}

const userViewStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    position: 'absolute',
    top: 0,
    marginTop: 10,
    color: 'green',
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },
  buttonContainer: {
    marginBottom: Dimensions.get('window').height*0.01
  }
});