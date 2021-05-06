import React,{Component}from 'react'
import {Text,View,TouchableOpacity} from 'react-native'
import BookTransactionScreen from './screens/bookTransactionScreen'
import BookSearchScreen from './screens/bookSearchScreen'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
export default class App extends Component{
  constructor(){
    super ()
  }
  render(){
    return(
      <AppContainer/>
    )
  }
}
const AppNavigator=createBottomTabNavigator({
  BookTransactionScreen:{screen:BookTransactionScreen},
BookSearchScreen:{screen:BookSearchScreen},
})
const AppContainer=createAppContainer(AppNavigator)


