import   Carousel     from 'react-native-snap-carousel';
import { View,
         StyleSheet,
         Text,
         Image,
         Dimensions} from 'react-native';
import   React,
       { Component } from 'react';

export default class SnapCarousel extends React.Component {


    _renderItem ({item, index}) {
        return (
          <View style={snapCarouselStyle.slide}>
            <Text style={snapCarouselStyle.caption}>
              <Image
                source={{uri: item}}
                style={{
                        width: Dimensions.get('window').width*0.7,
                        height: Dimensions.get('window').height*0.4
                        }}
              />
              </Text>
          </View>
        );
      }

    render () {

      var images = this.props.images


    return (
      <Carousel
        ref                   = {(c) => { this._carousel = c; }}
        data                  = {images}
        renderItem            = {this._renderItem}
        sliderWidth           = {Dimensions.get('window').width*1}
        sliderHeight          = {Dimensions.get('window').height*0.4}
        itemWidth             = {Dimensions.get('window').width*0.7}
        itemHeight            = {Dimensions.get('window').height*0.7}
        layout                = {'default'}
        layoutCardOffset      = {19}
        vertical              = {false}
        activeSlideAlignment  = {'center'}
        useScrollView         = {true}
        loop                  = {true}
      />
      );
    }
  }

const snapCarouselStyle = StyleSheet.create({
  slide:          {
    marginTop:        10,
    marginBottom:     10,
    justifyContent:   'center',
    alignItems:       'center',
    },
  caption:          {
    justifyContent:   'center',
    alignItems:       'center',
    color:            'black',
    },
  });

// NB: Imported from: https://github.com/archriss/react-native-snap-carousel/blob/master/README.md#layouts-and-custom-interpolations
