import React from 'react'
import { View, Text, Platform, Image, TouchableHighlight, Dimensions } from 'react-native'

import MultiSwitch from "./MultiSwitch.js";
import { Icon } from "native-base"

import _ from 'lodash';

export default class VWayToggle extends React.Component {

    constructor(props) {
    super(props);

    this.setActiveItem = this.setActiveItem.bind(this);
    this.changeToggleSelection = this.changeToggleSelection.bind(this);

  }

    state = {
        activeIndex: 1,
        vegan: false,
        vegetarian: true,
        vCurious: false
      };

  changeToggleSelection(number){

      if (number === 0 ) {
      this.setState({
        vegan: true,
        vegetarian: false,
        vCurious: false
      })
    }

      else if (number === 1){
      this.setState({
        vegan: false,
        vegetarian: true,
        vCurious: false
      })
    }

    else {
      this.setState({
        vegan: false,
        vegetarian: false,
        vCurious: true
      })
    }

  }

  setActiveItem(number){

    this.setState({
      activeIndex: number
    }, function(){

      this.changeToggleSelection(number)

    }
  )

  }

    render() {

        return (
          <View style={{flex: 1, flexDirection: 'column', justifyContent: "space-between", alignItems: 'center'}}>

            <View style={{width: Dimensions.get('window').width*0.3, justifyContent: 'center', alignItems: 'center'}}>
              <MultiSwitch choiceSize={Dimensions.get('window').width*0.2}
                            activeItemStyle={[{color: 'white'}, {color: 'white'}, {color: 'white'}, ]}
                            layout={{vertical: 0, horizontal: -1}}
                            onActivate={(number) => this.setActiveItem(number)}
                            containerStyles={_.times(3, () => ({
                              backgroundColor: '#78ffd6',
                              borderRadius: 40,
                              borderWidth: 1,
                              borderColor: "white",
                              justifyContent: 'space-between'

                            }))}
                            active={1}>
                            <View>
                            <Text style={{color: this.state.activeIndex === 0 ? 'black' : 'grey'}}>Vegan</Text>
                            </View>
                            <View>
                            <Text style={{color: this.state.activeIndex === 1 ? 'black' : 'grey'}}>Vegetarian</Text>
                            </View>
                            <View>
                            <Text style={{color: this.state.activeIndex === 2 ? 'black' : 'grey'}}>V-curious</Text>
                            </View>
              </MultiSwitch>
            </View>
          </View>
        )
    }
}