import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import { RootAuthStackParamList } from 'types/NavTypes'

const Stack = createNativeStackNavigator<RootAuthStackParamList>()

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
