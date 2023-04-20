import { TamaguiProvider, Theme } from '@tamagui/web'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import { YStack } from 'tamagui'

import AppRoute from './src/App'

import config from './tamagui.config'

if (__DEV__) {
  // @ts-ignore
  import('./ReactotronConfig')
}

const App = () => {
  /* const colorScheme = useColorScheme(); */
  const colorScheme = 'dark'
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <YStack f={1}>
          <AppRoute />
          <StatusBar style='light' />
        </YStack>
      </Theme>
      <Toast />
    </TamaguiProvider>
  )
}
export default App
