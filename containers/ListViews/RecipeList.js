import    React from 'react';
import {  FlatList,
          ImageBackground,
          TouchableOpacity,
          StyleSheet,
          ScrollView,
          Platform,
          TouchableHighlight,
          Image,
          TextInput,
          Dimensions,
          Button,
          Alert,
          Text,
          View } from 'react-native';
import {  Constants,
          Font } from 'expo'
import    GlobalButton from '../../components/GlobalButton.js';
import    TwoWayToggle from '../../components/TwoWayToggle.js';
import    AutoHeightImage from 'react-native-auto-height-image';
import    Expo, {
          ImagePicker } from 'expo';
import    AddItemButton from '../../components/AddItemButton.js';
import    FaveButton from '../../components/FaveButton.js';
import    SmallTwoWayToggle from '../../components/SmallTwoWayToggle.js';
import    LoadingCelery from '../../components/LoadingCelery.js';
import {  Permissions} from 'expo'
import    Pagination from 'react-native-pagination';
import    Ionicons from 'react-native-vector-icons/Ionicons';
import    Autocomplete from 'react-native-autocomplete-input';
import axios from 'axios';
import * as TimeGreeting from '../../helper_functions/TimeGreeting.js';
import * as ReverseArray from '../../helper_functions/ReverseArray.js';
import * as ShuffleArray from '../../helper_functions/ShuffleArray.js';
import    GuestRegistrationOffer from '../../components/GuestRegistrationOffer.js';
import _ from 'lodash';
const     ITEM_HEIGHT = 100;
const { width, height } = Dimensions.get('window');

export default class RecipeList extends React.Component {
  static navigationOptions = {
    title: null,
    headerTitle: (
     <AutoHeightImage width={75} style={{position: 'absolute', right: Platform.OS === 'android' ? 0 : -65 }} source={require('../../assets/greenlogo.png')}/>
 ),
}

  constructor(props) {
  super(props);

  this.changeToggleSelection = this.changeToggleSelection.bind(this);
  this.redirectToView = this.redirectToView.bind(this);
  this.openRegistrationOverlay = this.openRegistrationOverlay.bind(this);
  this.closeRegistrationOverlay = this.closeRegistrationOverlay.bind(this);
  this.handleRegistrationRequest = this.handleRegistrationRequest.bind(this);
}

  state = {
    isLoading: false,
    recipeTyped: "",
    seeOnlyVegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? true : false,
    recipesLoading: true,
    registrationOverlayVisible: false,
  }

  getActiveToggleIndex(){
    console.log("Active index: ", this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? 0 : 1);
    return this.props.navigation.getParam('user_is_vegan', 'NO-ID') === "vegan" ? 0 : 1
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

  async componentDidMount() {

  await Font.loadAsync({
     'PoiretOne-Regular': require('../../assets/fonts/PoiretOne-Regular.ttf'),
   });

    this.setState({ fontLoaded: true });
      var token = this.props.navigation.getParam('token', 'NO-ID');
      var self = this;
      axios.get('http://nuv-api.herokuapp.com/recipes',

   { headers: { Authorization: `${token}` }})

   .then(function(response){

     var responseItems = JSON.parse(response.request['_response'])
     var recipeItems = ShuffleArray.shuffle(responseItems);
     recipeItems.forEach((recipe, index) => {
       recipe['key'] = recipe.id
     })

     self.setState({
       recipeItems:  self.props.navigation.getParam('user', 'NO-ID') === true ?
                     recipeItems.filter(recipeItem => recipeItem.user_id === self.props.navigation.getParam('user_id', 'NO-ID'))
                     : recipeItems
     },
     function(){
       self.setState({
         names: self.state.recipeItems.map((recipe) => recipe.title),
         ids: self.state.recipeItems.map((recipe) => recipe.id)
       }, function(){
         self.setState({
           recipesLoading: false
         }, function(){
           // this.populateRecipes()
         })
       })
     }
   )
   }).catch(function(error){
     console.log("Error: ", error);
   })

   }

   populateRecipes(){
     var self = this;
     axios.get('https://api.edamam.com/search?q=dinner&app_id=ed97753a&app_key=ee493f15666062a6a2e53559f9b3309f&from=0&to=500&health=vegetarian')

  .then(function(response){

    var recipesArray = []

    response.data.hits.forEach((recipe) => {
      recipe = {
        name: recipe.recipe.label,
        url: recipe.recipe.url,
        totalTime: recipe.recipe.totalTime,
        ingredients: recipe.recipe.ingredientLines,
        image: recipe.recipe.image,
        healthLabels: recipe.recipe.healthLabels
      }
      recipesArray.push(recipe)
    })

      var token = self.props.navigation.getParam('token', 'NO-ID');
      for (recipe of recipesArray) {

      if (!recipe.healthLabels.includes("Vegan")){

      const formData = new FormData();
      formData.append('recipe[title]', recipe.name.includes("Dinner Tonight:") ? recipe.name.replace('Dinner Tonight: ', "") : recipe.name);
      formData.append('recipe[method]', recipe.image);
      formData.append('recipe[description]', recipe.url)
      formData.append('recipe[content_is_vegan]', false);
      formData.append('recipe[category]', "Dinner");

      for (var i = 0; i < recipe.ingredients.length; i++){
        formData.append('recipe[keywords][]', recipe.ingredients[i])
      }

      formData.append('recipe[cooking_time]', recipe.totalTime);

      axios.post('http://nuv-api.herokuapp.com/recipes',
     formData,
   { headers: { Authorization: `${token}`, 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' }})

   .then(function(response){
     console.log("RESP", response);
   }).catch(function(error){ console.log(error)})
 }}
  }).catch(function(error){
    console.log("Error: ", error);
  })
   }

   returnMessage(){
     if (this.props.navigation.getParam('user', 'NO-ID') != true){
       return "Scroll through the NüV community recipes. Tap one to see its details"
     }
     else if (this.props.navigation.getParam('viewingAnotherUser', 'NO-ID') === true && this.props.navigation.getParam('uploader', 'NO-ID')){
       return `Here are all recipe contributions made by ${this.props.navigation.getParam('uploader', 'NO-ID').name}`

     }
     else {
     return "Here are your NüV recipe contributions!"
   }
   }

   changeToggleSelection(selection){

     this.setState({
       seeOnlyVegan: selection
     }, function(){
       console.log("See only vegan: ", this.state.seeOnlyVegan);
     })

   }

   returnExtraMessage(){
      if (this.state.recipeItems && this.state.recipeItems.length == 0 && !this.props.navigation.getParam('uploader', 'NO-ID') && this.props.navigation.getParam('user', 'NO-ID') === true){
      return <Text style={{fontSize: Dimensions.get('window').width > 750 ? 24 : 20, marginTop: Dimensions.get('window').height*0.02}}> You have not added any recipes to NüV yet. </Text>
   }
   else if (this.state.recipeItems && this.state.recipeItems.length == 0 && this.props.navigation.getParam('uploader', 'NO-ID') && this.props.navigation.getParam('user', 'NO-ID') === true){
     return <Text style={{fontSize: Dimensions.get('window').width > 750 ? 24 : 20, marginTop: Dimensions.get('window').height*0.02}}> It seems that {this.props.navigation.getParam('uploader', 'NO-ID').name} has not added any recipes to NüV yet. </Text>
   }
    else {
      return null;
    }
 }

 deleteRecipeItem(recipe){
   const {navigate} = this.props.navigation;

   var self = this;
   var token = this.props.navigation.getParam('token', 'NO-ID');
   var recipe = recipe;

   axios.delete(`http://nuv-api.herokuapp.com/recipes/${recipe.id}`,

 { headers: { Authorization: `${token}` }})

 .then(function(response){

   var updatedRecipeItems = self.state.recipeItems.filter(item => item.id != recipe.id)

   self.setState({
     recipeItems: updatedRecipeItems,
   }, function(){
     Alert.alert(
            `${recipe.title} has been deleted`
         )

    console.log("Response from delete post: ", response);
   })
  }
 )
 .catch(function(error){
  console.log("Error: ", error);
 })
 }

  getFlatListItems = () => {
    this.setState({ isLoading: true });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  setItemAsActive(activeItem) {
    this.setState({ scrollToItemRef: activeItem });
    this.setState({
      activeId: activeItem.item.id,
      activeItem: activeItem
  })
}

  handleLongRecipeNames(name){
    if (name.length > 29){
     return name.substring(0, 29) + '...'
   }
   else {
     return name
   }
  }

  searchBarPlaceholderText(){
    return `Enter recipe key word`;
  }

  removeNonAlphanumeric(string){
    return string.replace(/[^\w\s]/gi, '');
  }

  redirectToView(recipe, navigation){
    const {navigate} = navigation
    this.setState({ clickedRecipe: recipe}, function(){ navigate('RecipeView', {                current_user_id: this.props.navigation.getParam('user_id', 'NO-ID')
, guest: this.props.navigation.getParam('guest', 'NO-ID'), avatar: this.props.navigation.getParam('avatar', 'NO-ID'), profile_id: this.props.navigation.getParam('id', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.state.ids[this.state.names.indexOf(this.state.clickedRecipe)], name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})})
  }

  findRecipe(query, diet) {

  var sanitizedQuery = this.removeNonAlphanumeric(query);

   if (sanitizedQuery === '') {
     return [];
   }
   if (this.state.seeOnlyVegan){
     var recipes = this.state.recipeItems.filter(recipe => recipe.content_is_vegan === true).map(recipe => recipe.title);
   }
   else {
     var recipes = this.state.names;
   }

   const regex = new RegExp(`${sanitizedQuery.trim()}`, 'i');
   console.log("Matches: ", recipes.filter(recipe => recipe.search(regex) >= 0));
   if (recipes.filter(recipe => recipe.search(regex) >= 0).length > 5) {
     return recipes.filter(recipe => recipe.search(regex) >= 0).slice(0, 4);
   }
   else {
   return recipes.filter(recipe => recipe.search(regex) >= 0);
 }
  }

  renderMatches(recipes, navigation){
    const {navigate} = navigation

    return recipes.map((recipe, i) =>

      <TouchableOpacity
      onPress = {() => this.state.ids[this.state.names.indexOf(recipe)] < 3536 ? this.redirectToView(recipe, navigation) : Alert.alert(
           `Unfortunately this particular recipe is not clickable. Find it in the horizontal list below to view it`
          ) }
        key={i}
        style={{flexDirection: 'row'}}
      >
      <Text
        style={{
          flex: 1,
          flexWrap: 'wrap',
          textAlign: 'center',
          color: 'black',
          fontSize: 16,
          paddingTop: 10,
          paddingBottom: 10}}
        key={i}>
        {recipe}
      </Text>
      </TouchableOpacity>
    )
  }

  renderItem = (o, i) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => this.setItemAsActive(o)}
          style={[
            registerUserStyle.renderItem,
            this.state.activeId === _.get(o, 'item.id', false)
              ? { postcodegroundColor: 'white', borderRadius: 10, marginBottom: 0 }
              : { backgroundColor: 'white', marginBottom: 0 }
          ]}
        >
        <AutoHeightImage width={Dimensions.get('window').width < 750 ? Dimensions.get('window').width*0.20 : Dimensions.get('window').width*0.20} source={require('../../assets/AppIcons/cutlerynew.png')}/>
          <Text
            style={[
              registerUserStyle.name2,
              this.state.activeId === o.item.id
                ? { color: '#a2e444', fontSize: Dimensions.get('window').width > 750 ? 20 : 13, flexWrap: 'wrap', textAlign: 'center', width: Dimensions.get('window').width*0.25 }
                : { color: 'black', fontSize: Dimensions.get('window').width > 750 ? 20 : 13, flexWrap: 'wrap', textAlign: 'center', width: Dimensions.get('window').width*0.25 }
            ]}
          >
            {o.item.title ? this.handleLongRecipeNames(o.item.title) : 'Unknown'}
          </Text>
          {
            this.props.navigation.getParam('admin', 'NO-ID') === true ? (
          <View style={{alignItems: 'center'}} key={i+18}>
          <TouchableHighlight
          onPress={() => this.state.activeId != o.item.id ? this.deleteRecipeItem(o.item) : Alert.alert(
               `Cannot delete this item as it is active. Click off it to delete it via the same button`
              )}
          style={{marginTop: Dimensions.get('window').height*0.008}}
          underlayColor={'white'}
          key={i+22}>
          <Image key={i+2}
            source={require('../../assets/AppIcons/trash.png')}
            style={{width: Dimensions.get('window').height*0.02, height: Dimensions.get('window').height*0.02}}/>
          </TouchableHighlight>
          </View>
        ) : null
      }
        </TouchableOpacity>
      </View>
    );
  };

  clearList() {
    this.setState({ items: [] });
  }
  onEndReached(o) {
    console.log(' reached end: ', o);
  }

  onViewableItemsChanged = ({ viewableItems }) =>
    this.setState({ viewableItems });

  render() {
    const {navigate} = this.props.navigation;
    const query = this.state.recipeTyped;
    const recipes = this.findRecipe(query, false);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const self = this;

    const ListEmptyComponent = () => (
      <View
        style={{
          flex: 1,
          height,
          width,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={() => this.getFlatListItems()}>
          <Text
            style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: 20,
              textAlign: 'center',
              margin: 10
            }}
          >
        Nothing is Here!
          </Text>
          <Text
            style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: 15,
              textAlign: 'center'
            }}
          >
            Try Again?
          </Text>
        </TouchableOpacity>
      </View>
    );

    if (this.state.recipesLoading === false){
    return (

      <View style={[registerUserStyle.firstContainer]}>
        <View style={registerUserStyle.innerContainer}>
          {!this.state.activeItem && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}
            >
            <Text
              style={{
                textAlignVertical: 'center',
                color: 'black',
                textAlign: 'center',
                fontWeight: '400',
                fontSize: Dimensions.get('window').width > 750 ? 24 : 18,
                margin: 30
              }}
            >
            {this.returnMessage()}
            </Text>

            {this.returnExtraMessage()}
            </View>
          )}

          { this.state.activeItem ? (

          <View style={{
            alignItems: 'center',
            marginTop: Dimensions.get('window').height*0.20, height: Dimensions.get('window').height*0.6,
            width: Dimensions.get('window').width}}
          >
          <TouchableHighlight
          underlayColor="white"
          onPress={() => this.state.ids[this.state.names.indexOf(this.state.activeItem.item.title)] < 3536 ? navigate('RecipeView', {                current_user_id: this.props.navigation.getParam('user_id', 'NO-ID')
, guest: this.props.navigation.getParam('guest', 'NO-ID'), avatar: this.props.navigation.getParam('avatar', 'NO-ID'), profile_id: this.props.navigation.getParam('id', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.state.activeItem.item.id, name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')}) :
          Alert.alert(
               `Unfortunately this particular recipe can not be viewed at the moment`
              )
        }

          style={underlayColor="white"}
          >
          <AutoHeightImage
            style={{
              marginTop: Dimensions.get('window').height*0.05
              }}
            width={
              Dimensions.get('window').width < 750 ?
              Dimensions.get('window').width*0.5 :
              Dimensions.get('window').width*0.4}
            source={{uri: this.state.activeItem.item.recipe_main_image ? `http://res.cloudinary.com/nuv-api/${this.state.activeItem.item.recipe_main_image}` : this.state.activeItem.item.method}}
            />
        </TouchableHighlight>

          <Text
          onPress={() => this.state.ids[this.state.names.indexOf(this.state.activeItem.item.title)] < 3536 ? navigate('RecipeView', {                 current_user_id: this.props.navigation.getParam('user_id', 'NO-ID')
, guest: this.props.navigation.getParam('guest', 'NO-ID'), avatar: this.props.navigation.getParam('avatar', 'NO-ID'), profile_id: this.props.navigation.getParam('id', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.state.activeItem.item.id, name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')}) :
          Alert.alert(
               `Unfortunately this particular recipe can not be viewed at the moment`
              )
        }
           style={{
            color: '#696969',
            marginTop: Dimensions.get('window').height*0.02,
            fontSize: Dimensions.get('window').width > 750 ? 20 : 16,
            textAlign: 'center'}}>
              {this.state.activeItem.item.title}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

          <AutoHeightImage source={require('../../assets/AppIcons/clock.png')} width={Dimensions.get('window').width*0.05} />

          <Text style={{
            marginTop: Dimensions.get('window').height*0.01,
            marginLeft: 10,
            fontSize: Dimensions.get('window').width > 750 ? 20 : 12,
            textAlign: 'center'}}>
            Prep + Cook: {this.state.activeItem.item.prep_time ? this.state.activeItem.item.prep_time + this.state.activeItem.item.cooking_time : this.state.activeItem.item.cooking_time} mins
          </Text>
          </View>

           </View>

         ) : null

       }

        </View>

        <View style={{ flex: 1, height: height, width}}>

        {this.state.recipeItems ? (
          <FlatList
          style={{marginBottom: -(height*0.08)}}
            ListEmptyComponent={ListEmptyComponent}
            horizontal
            ref={r => (this.refs = r)}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index
            })}
            onRefresh={o => console.log(o)}
            initialScrollIndex={0}
            refreshing={this.state.isLoading}
            onEndReached={o => this.onEndReached}
            keyExtractor={(o, i) => o.key.toString()}
            data={this.state.seeOnlyVegan === true ? this.state.recipeItems.filter(recipe => recipe.content_is_vegan === true) : this.state.recipeItems}
            scrollRenderAheadDistance={width * 2}
            renderItem={this.renderItem}
            onViewableItemsChanged={this.onViewableItemsChanged}
          />

        ) : null
      }

      {this.state.registrationOverlayVisible ? (
      <GuestRegistrationOffer
      openOverlay    = {this.openRegistrationOverlay}
      handleRegistrationRequest   = {this.handleRegistrationRequest}
      navigation =                  {this.props.navigation}
      closeRegistrationOverlay   = {this.closeRegistrationOverlay}
      overlayVisible = {this.state.registrationOverlayVisible}
    />
    ) : null}

        {
          this.state.recipeItems ? (
          <Pagination
            horizontal
            debugMode={true}
            listRef={this.refs}m
            endDotIconFamily={'MaterialIcons'}
            dotIconNameActive={'checkbox-blank-circle'}
            dotIconColorActive={'#a2e444'}
            dotIconNameNotActive={'checkbox-blank-circle-outline'}
            dotIconColorNotActive={'#2e8302'}
            dotIconNameEmpty={'close'}
            dotTextHide={true}
            dotTextColor={'#2e8302'}
            dotIconSizeNotActive={15}
            dotIconSizeActive={15}
            dotIconSizeEmpty={15}
            dotColorhasNotSeen={"red"}
            paginationVisibleItems={this.state.viewableItems}
            paginationItems={this.state.recipeItems}
            paginationItemPadSize={3}
          />
        ) : null
      }
        </View>

        <View style={{flex: 1, flexDirection: 'row', position: 'absolute', top: height*0.012}}>
          <SmallTwoWayToggle changeToggleSelection={this.changeToggleSelection} activeIndex={this.getActiveToggleIndex()} marginLeft={5}/>
          <AddItemButton navigation={this.props.navigation}
          onPress={() => this.props.navigation.getParam('guest', 'NO-ID') === true ? this.openRegistrationOverlay() : navigate('RecipeForm', {                current_user_id: this.props.navigation.getParam('user_id', 'NO-ID')
, avatar: this.props.navigation.getParam('avatar', 'NO-ID'), token: this.props.navigation.getParam('token', 'NO-ID'), id: this.props.navigation.getParam('id', 'NO-ID'), name: this.props.navigation.getParam('name', 'NO-ID'), bio: this.props.navigation.getParam('bio', 'NO-ID'), location: this.props.navigation.getParam('location', 'NO-ID'), user_is_vegan: this.props.navigation.getParam('user_is_vegan', 'NO-ID')})} />
          {/*<FaveButton navigation={this.props.navigation}/>*/}
        </View>

    <View style={{flexDirection: 'column', position: 'absolute', borderRightWidth: 0.5, borderColor: 'black', top: height*0.025}}>

    <Autocomplete
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={{width: Dimensions.get('window').width*0.43}}
      data={this.state.names === 1 && comp(query, this.state.names[0]) ? [] : recipes}
      defaultValue={query}
      inputContainerStyle={{flex: 1}}
      onChangeText={recipe => this.setState({ recipeTyped: recipe })}
      placeholder={this.searchBarPlaceholderText()}
      placeholderTextColor="black"
      renderItem={({ recipe }) => (
        <TouchableOpacity onPress={() => this.setState({ recipeTyped: this.props`${dinosaur}` })}>
        </TouchableOpacity>
      )}
    />

      {this.findRecipe(query).length > 0 ? (
        <View style={{backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: 'black', height: height*0.55}}>
        <ScrollView style={{flexWrap: 'wrap', backgroundColor: 'white'}}>
        {this.renderMatches(recipes, this.props.navigation)}
        </ScrollView>
        </View>
      ) : (
        <View style={{backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: 'black'}}>
        <ScrollView style={{backgroundColor: 'white'}}>
        {this.renderMatches(recipes, this.props.navigation)}
        </ScrollView>
        </View>
      )}

    </View>

    {this.state.activeItem ? (
    <View style={{flexDirection: 'column', position: 'absolute', top: Dimensions.get('window').height*0.14}}>
    <Text style={[registerUserStyle.galleryNameHeader, { textAlign: 'center'}]}>{this.state.activeItem.name}</Text>
    </View>
  ) : null
}

    </View>
  )
}

  else {

    return (

      <View style={[registerUserStyle.celeryContainer]}>
      <LoadingCelery />
      </View>

    )
  }

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
    marginBottom: Platform.OS === 'ios' ? Dimensions.get('window').height*0.05 : Dimensions.get('window').height*0.05
  },
  header: {
    fontSize: 24,
    color: '#a2e444',
    textAlign: 'center',
    marginTop:  Constants.statusBarHeight+10,
    marginBottom: Dimensions.get('window').height*0.01
  },
  firstContainer: {
    flex: 1,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  celeryContainer: {
    flex: 1,
    backgroundColor: '#FBFEFC',
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    top: height*0.04,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  galleryNameHeader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: Dimensions.get('window').width > 750 ? 20 : 15,
    color: 'black',
  },
});
