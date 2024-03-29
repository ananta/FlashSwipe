import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import DashboardScreen from './DashboardScreen'
import AccountScreen from './AccountScreen'
import AddDecksScreen from './AddDecks'
import DeckInfoScreen from './DeckInfo'
import YourDeckScreen from './YourDecksScreen'
import SwipeScreen from './SwipeScreen'
import { RootStackParamList } from 'types/NavTypes'

const Tab = createBottomTabNavigator()

const Stack = createNativeStackNavigator<RootStackParamList>()

const DashStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={DashboardScreen} />
      <Stack.Screen name='Add Deck' component={AddDecksScreen} />
      <Stack.Screen name='Deck Info' component={DeckInfoScreen} />
      <Stack.Screen name='Public Decks' component={YourDeckScreen} />
      <Stack.Screen name='Swipe Screen' component={SwipeScreen} />
    </Stack.Navigator>
  )
}

const AccountStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Profile'>
      <Stack.Screen name='Profile' component={AccountScreen} />
    </Stack.Navigator>
  )
}

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='Feed'
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name='Dash'
        component={DashStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={AccountStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default AppNavigator
