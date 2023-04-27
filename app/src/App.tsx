import { useEffect } from 'react'
import { AppState, Platform } from 'react-native'
import type { AppStateStatus } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from '@tanstack/react-query'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'

import AppNavigator from 'screens/app'
import AuthNavigator from 'screens/auth'
import { useStore } from 'store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: 0,
    },
    mutations: {
      retry: 2,
      cacheTime: 1000 * 10,
    },
  },
})

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

const AppRoute = () => {
  const { isLoggedIn } = useStore()
  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
    return () => subscription.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={DarkTheme}>
        {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default AppRoute
