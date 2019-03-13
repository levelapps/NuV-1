import    React from 'react';
import {  ImageBackground,
          StyleSheet,
          Image,
          Alert,
          Dimensions,
          Text,
          View,
          TextStyle,
          ViewStyle,
          ScrollView, } from 'react-native';
import {  Constants,
          Font } from 'expo'
import    NavBar from '../../components/NavBar.js';
import    GlobalButton from '../../components/GlobalButton.js';
import    AutoHeightImage from 'react-native-auto-height-image';
import    axios from 'axios';
import    HeroImageCarousel from '../../components/HeroImageCarousel.js';

export default class Landing extends React.Component {
  static navigationOptions = {
      header: null,
  };


  componentDidMount(){
    this.nudgeHeroku('http://nuv-api.herokuapp.com/login')
  }

  nudgeHeroku(url){
    return axios.get(url)
      .then((response) => console.log(`${url} response: `, response.data)
    ).catch(err => { console.log('caught', err.message); });
  }

render() {
  const {navigate} = this.props.navigation;
    return (

      <View style={landingStyle.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{alignItems: 'center'}}>
        <AutoHeightImage
          source={require('../../assets/greenlogo.png')}
            style={{marginTop:Dimensions.get('window').height*0.07}}
            width={Dimensions.get('window').width < 750 ? Dimensions.get('window').width*0.75 : Dimensions.get('window').width*0.57} />
      </View>

      <View style={landingStyle.descriptionContainer}>
          <Text style={landingStyle.descriptionText1}>
              Life support for vegans {"\n"}
              vegetarians & the v.curious
          </Text>
      </View>

      <View>
      <HeroImageCarousel />
      </View>
      <View style={landingStyle.iconsContainer}>
        <GlobalButton
          marginLeft={Dimensions.get('window').width*0.16}
          onPress={() => navigate('SignIn', {name: 'Home'})}
          buttonTitle={"Sign in"}
        />
        <GlobalButton
          marginRight={Dimensions.get('window').width*0.16}
          onPress={() => navigate('RegisterUser', {name: 'Home'})} buttonTitle={"Register"}
        />
      </View>

      <Text
      style={{fontSize: Dimensions.get('window').width > 750 ? 20 : 16, color: '#2e8302', textAlign: 'center', paddingLeft: 20, paddingRight: 20,
      marginBottom: Dimensions.get('window').height*0.035
    }}
      onPress={() => this.guestSignIn()}
      >
      Browse NüV as guest
     </Text>

    </ScrollView>
  </View>
    );
  }
}

const landingStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    marginTop: Dimensions.get('window').height*0.01,
    paddingLeft: Dimensions.get('window').width*0.0275,
    paddingRight: Dimensions.get('window').width*0.0275,
  },
  descriptionText1: {
    marginTop: Dimensions.get('window').height*0.03,
    marginBottom: Dimensions.get('window').height*0.03,
    paddingLeft: Dimensions.get('window').width*0.005,
    paddingRight: Dimensions.get('window').width*0.005,
    textAlign: 'center',
    fontSize: Dimensions.get('window').width < 750 ? 18 : 20,
    color: '#696969',
  },
  iconsContainer: {
    width: Dimensions.get('window').width,
    marginLeft: 0,
    marginTop: Dimensions.get('window').height*0.035,
    marginBottom: Dimensions.get('window').height*0.035,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
