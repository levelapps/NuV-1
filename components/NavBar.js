import   React from 'react';
import { StyleSheet,
         TextInput,
         Image,
         TouchableHighlight,
         Dimensions,
         Button,
         Text,
         View } from 'react-native';
import { Constants } from 'expo'

export default class NavBar extends React.Component {
  static navigationOptions = {
    title: 'Enter your NüV registration data below',
    header: null,
  };

  constructor(props) {
  super(props);
  }

  state = {
    };

  render() {

  const {navigate} = this.props.navigation;

  return (
    <View style={navStyle.iconsContainer}>

      <TouchableHighlight underlayColor="white"
        onPress={() => navigate('Home', this.props.attributes)}>
          <Image source={require('../assets/NavBarIcons/Green/greenhome.png')} style={{height: 40, marginLeft: Dimensions.get('window').width*0.11, marginRight: Dimensions.get('window').width*0.11, width: 40, marginBottom: 20}}/>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="white"
      onPress={() => this.props.openOverlay() }>
          <Image source={require('../assets/NavBarIcons/Green/greenworld.png')} style={{height: 40, marginRight: Dimensions.get('window').width*0.11, width: 40, marginBottom: 20}}/>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="white"
      onPress={() => navigate('Favourites', this.props.attributes)}>
          <Image source={require('../assets/NavBarIcons/Green/lightstar.png')} style={{height: 40, marginRight: Dimensions.get('window').width*0.11, width: 40, marginBottom: 20}}/>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="white"
        onPress={() => navigate('UserView', {
          user_id: this.props.navigation.getParam('user_id', 'NO-ID'),
          settings: true,
          avatar: this.props.navigation.getParam('avatar', 'NO-ID'),
          token: this.props.navigation.getParam('token', 'NO-ID'),
          id: this.props.navigation.getParam('id', 'NO-ID'),
          name: this.props.navigation.getParam('name', 'NO-ID'),
          bio: this.props.navigation.getParam('bio', 'NO-ID'),
          location: this.props.navigation.getParam('location', 'NO-ID'),
          user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})}>
          <Image source={require('../assets/NavBarIcons/Green/lightsettings.png')} style={{height: 40, marginRight: Dimensions.get('window').width*0.11, width: 40, marginBottom: 20}}/>
      </TouchableHighlight>
    </View>
    );
  }
}

const navStyle = StyleSheet.create({
  iconsContainer: {
    position:         'absolute',
    bottom:            0,
    backgroundColor:  'white',
    justifyContent:   'center',
    alignItems:       'center',
    flexDirection:    'row',
  },
});
