import   React from 'react';
import { StyleSheet,
         ScrollView,
         Platform,
         TouchableHighlight,
         Image,
         TextInput,
         Dimensions,
         Button,
         Text,
         View,
         TouchableOpacity } from 'react-native';
import { Constants } from 'expo'
import   GlobalButton from '../../components/GlobalButton.js';
import   SnapCarousel       from '../../components/SnapCarousel.js';
import   LoadingCelery       from '../../components/LoadingCelery.js';
import   AddItemButton from '../../components/AddItemButton.js';
import   FaveButton from '../../components/FaveButton.js';
import   ShareButton from '../../components/ShareButton.js';
import   SmallTwoWayToggle from '../../components/SmallTwoWayToggle.js';
import   AutoHeightImage from 'react-native-auto-height-image';
import   Expo, {
         ImagePicker } from 'expo';
import { Permissions} from 'expo'
import   MapView, {
         PROVIDER_GOOGLE} from 'react-native-maps';
import   Map from '../../containers/Global/Map.js';
import   StarRating from 'react-native-star-rating';
import { AsyncStorage, Alert } from "react-native"
import axios from 'axios';
import moment from 'moment';

export default class RecipeView extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle:(
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
    ),
  }

  constructor(props) {
    super(props);
      this.onStarRatingPress = this.onStarRatingPress.bind(this);
      this.addRecipeToFavourites = this.addRecipeToFavourites.bind(this);
      this.checkFavouriteStatus = this.checkFavouriteStatus.bind(this);
      }
      state = {
      starRating: 3,
      starCount: 2
    };

    componentDidMount(){

      var id = this.props.navigation.getParam('id', 'NO-ID');
      console.log("ID", id);
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;

      axios.get(`http://nuv-api.herokuapp.com/recipes/${id}`,

   { headers: { Authorization: `${token}` }})

   .then(function(response){

     var recipeItem = JSON.parse(response.request['_response'])

     self.setState({
       recipeItem: recipeItem
     },
     function(){
       console.log("Recipe item", self.state.recipeItem);
     }
   )
   }).catch(function(error){
     console.log("Error: ", error);
   })

    }

  checkFavouriteStatus(viewedRecipe) {
    try {
      AsyncStorage.getItem('recipe_favourites').then((recipes) => {
        const recips = recipes ? JSON.parse(recipes) : [];

      if (recips.length > 0){
        var names = recips.map((recipe) => recipe.name);

          if (names.includes(viewedFavourite)){
            this.setState({viewedRecipeAlreadyFavourite: true}, function(){
              console.log("Already favourite");
            });
          }
            else {
              this.setState({viewedRecipeAlreadyFavourite: false},
              function(){
                console.log("Not already favourite");
              });
            }
          }
          else {
            this.setState({viewedRecipeAlreadyFavourite: false}, function(){
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

  addRecipeToFavourites = async() => {

    var self = this;

    var recipe = {name: this.state.recipeItem.title, cook_time: this.state.recipeItem.cooking_time}

    try {
      AsyncStorage.getItem('recipe_favourites').then((recipes) => {
        const recips = recipes ? JSON.parse(recipes) : [];
          if (recips.length > 0){
            var names = recips.map((recipe) => recipe.name);
          if (!names.includes(recipe.name)){
            recips.push(recipe);
            AsyncStorage.setItem('recipe_favourites', JSON.stringify(recips));
            this.setState({newFavouriteAdded: true}, function(){
              Alert.alert(
                   `${recipe.name} was added to your favourites!`
                  )
                })
              }
          else {
            Alert.alert(
               `${recipe.name} is already in your favourites!`
                )
              }
            }
          else {
            recips.push(recipe);
            AsyncStorage.setItem('recipe_favourites', JSON.stringify(recips));
            Alert.alert(
               `${recipe.name} was added to your favourites!`
                )
              }
            })}
          catch (error) {
            console.log(error);
          }
        }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
      });
    }

render() {
  const {navigate} = this.props.navigation;

  if (this.state.recipeItem){
    var images = [];
    for (image of this.state.recipeItem.recipe_images){
      if (image){
      images.push(image.recipe_image.url)
    }
    else {
      images.push(image.method)
    }
    }
  }

    return (

    <View style={recipeViewStyle.container}>

    { this.state.recipeItem ? (

    <ScrollView style={{width: Dimensions.get('window').width*1}} showsVerticalScrollIndicator={false}>
      <View style={recipeViewStyle.container}>
        <View style={{marginTop: Dimensions.get('window').height*0.02}}>
          </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <FaveButton
              navigation={this.props.navigation} handleButtonClick={this.addRecipeToFavourites}/>
              <AddItemButton
              navigation={this.props.navigation}
              onPress={() => navigate('RecipeForm', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})} />
            </View>
              <Text style={recipeViewStyle.recipename}>
                  {this.state.recipeItem.title}
              </Text>
            <AutoHeightImage width={Dimensions.get('window').width*1} style={{marginTop: Dimensions.get('window').width*0.025}} source={{uri: this.state.recipeItem.method}}/>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <AutoHeightImage width={Dimensions.get('window').width*0.1} style={{ borderRadius: Dimensions.get('window').width*0.025, margin: Dimensions.get('window').width*0.025 }} source={{uri: this.state.recipeItem.user_image}}/>
              <Text style={recipeViewStyle.recipetype}>
                {this.state.recipeItem.category}
              </Text>
            <ShareButton
            marginLeft={Dimensions.get('window').width*0.07}
            title="Shared from NüV"
            message="Message to share"
            url="www.level-apps.co.uk"
            subject="Hi, a NüV user though you would like to see this..."
             />
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{marginTop: Dimensions.get('window').height*0.01, fontSize: Dimensions.get('window').width > 750 ? 25 : 16, textAlign: 'center', flex: 1, flexDirection: 'row'}}>
            <AutoHeightImage source={require('../../assets/AppIcons/cooktime.png')} width={Dimensions.get('window').width*0.05} /> Prep: {this.state.recipeItem.prep_time}    <AutoHeightImage source={require('../../assets/AppIcons/preptime.png')} width={Dimensions.get('window').width*0.05} /> Cook: {this.state.recipeItem.cooking_time} </Text>
        </View>

        <View style={{alignItems: 'center'}}>
        <Text style={recipeViewStyle.recipetype}>
          Uploaded {moment(new Date(this.state.recipeItem.created_at), 'MMMM Do YYYY, h:mm:ss a').fromNow()} by {this.state.recipeItem.user}
        </Text>
        </View>

        <View >
          <View>
            <Text style={recipeViewStyle.recipeingredients}>
            Ingredients:{"\n"}
            </Text>
            <Text style={recipeViewStyle.recipeingredientsbody}>
          {this.state.recipeItem.ingredients}
            </Text>
          </View>
        </View>

        <View >
          <View>
            <Text style={recipeViewStyle.recipemethod}>
            Method:{"\n"}
            </Text>
            <Text style={recipeViewStyle.recipemethodbody}>
            {this.state.recipeItem.category}
            </Text>
          </View>
        </View>




        <View style={{alignItems: 'center', marginTop: Dimensions.get('window').height*0.005, width: Dimensions.get('window').width*1}}>
        <Text style={recipeViewStyle.vibeHeading}>NüV User Rating</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={this.state.starRating}
            fullStarColor={'#0DC6B5'}
            containerStyle={{marginTop: Dimensions.get('window').height*0.02, marginBottom: Dimensions.get('window').height*0.02}}
          />
        </View>

        <View style={{alignItems: 'center', marginTop: Dimensions.get('window').height*0.005, width: Dimensions.get('window').width*1}}>
          <Text style={recipeViewStyle.vibeHeading}>Rate this recipe</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'#0DC6B5'}
              containerStyle={{marginTop: Dimensions.get('window').height*0.02, marginBottom: Dimensions.get('window').height*0.02}}
            />
        </View>

        <View style={recipeViewStyle.submitContainer}>
          <GlobalButton
            marginLeft={Dimensions.get('window').width*0.05}
            buttonTitle="Rate and go"
            onPress={() => navigate('Home', {avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})}/>
        </View>
      </ScrollView>

    ) :

    <LoadingCelery />

  }
    </View>
  );
 }
}

const recipeViewStyle = StyleSheet.create({
  container: {
    backgroundColor:  'white',
    alignItems:       'center',
    justifyContent:   'center',
  },
  submitContainer: {
    alignItems:       'center',
    marginTop:        Dimensions.get('window').height*0.03,
    marginBottom:     Platform.OS === 'ios' ? Dimensions.get('window').height*0.05 : Dimensions.get('window').height*0.1
  },
  header: {
    textAlign:        'center',
    marginTop:        Constants.statusBarHeight+10,
    marginBottom:     Dimensions.get('window').height*0.01
  },
  recipeitem: {
    flex:             1,
    flexDirection:    'row',
    paddingBottom:    20,
  },
  recipetextcontainer: {
    flex:             1,
    flexDirection:    'column',
  },
  recipename: {
    color:            '#0dc6b5',
    fontSize:         20,
    fontWeight:       'bold',
    marginTop:        Dimensions.get('window').height*0.025,
    marginBottom:     Dimensions.get('window').height*0.025,
    marginLeft:       Dimensions.get('window').width*0.02,
    marginRight:      Dimensions.get('window').width*0.02,
    textAlign: 'center'
  },
  recipetype: {
    color:            '#0dc6b5',
    fontSize:         15,
    fontWeight:       'bold',
    marginTop:        20,
    marginBottom:     20,
  },
  recipeingredients: {
    color:            '#0dc6b5',
    margin:           4,
    fontSize:         18,
    marginLeft:       15,
  },
  recipeingredientsbody: {
    margin:           4,
    fontSize:         15,
    marginBottom:     40,
    marginLeft:       15,
  },
  recipemethod: {
    color:            '#0dc6b5',
    margin:           4,
    fontSize:         18,
    marginLeft:       15,
  },
  recipemethodbody: {
    margin:           4,
    fontSize:         15,
    marginLeft:       15,
  },
    profileItem: {
    padding:          Dimensions.get('window').width* 0.025,
    fontSize:         Dimensions.get('window').width>750 ? 24 : 16 ,
    color:            'black'
  },
  vibeHeading: {
  fontSize:           Dimensions.get('window').width > 750 ? 27 : 20,
  textAlign:          'center',
  color:              '#0DC6B5',
  marginTop:          Dimensions.get('window').height*0.03
},
  submitContainer: {
    alignItems:       'center',
    marginTop:        Dimensions.get('window').height*0.03,
    marginBottom:     Platform.OS === 'ios' ? Dimensions.get('window').height*0.15 : Dimensions.get('window').height*0.15
  },

  shareContainer: {
      alignItems:     'center',
      marginTop:      Dimensions.get('window').height*0.03,
      marginBottom:   Platform.OS === 'ios' ? Dimensions.get('window').height*0.05 : Dimensions.get('window').height*0.05
    },
});
