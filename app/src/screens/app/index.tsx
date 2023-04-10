import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import DashboardScreen from './DashboardScreen'
import AccountScreen from './AccountScreen'
import AddDecksScreen from './AddDecks'
import DeckInfoScreen from './DeckInfo'
import YourDeckScreen from './YourDecks'

const Tab = createBottomTabNavigator()

const Stack = createNativeStackNavigator()

const DashStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Dashboard' component={DashboardScreen} />
      <Stack.Screen name='Add Deck' component={AddDecksScreen} />
      <Stack.Screen name='Deck Info' component={DeckInfoScreen} />
      <Stack.Screen name='Your Decks' component={YourDeckScreen} />
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
        component={AccountScreen}
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
