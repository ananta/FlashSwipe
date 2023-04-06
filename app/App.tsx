import { TamaguiProvider, Theme } from '@tamagui/web';
import { YStack } from 'tamagui';

import config from './tamagui.config';

const App = () => {
  /* const colorScheme = useColorScheme(); */
  const colorScheme = 'dark';
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
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
  );
};
export default App;
