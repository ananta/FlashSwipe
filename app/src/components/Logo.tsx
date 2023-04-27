import { View } from 'react-native'
import { Svg, Rect, Path } from 'react-native-svg'

export const Logo = () => (
  <Svg width='100' height='100' viewBox='0 0 365 448' fill='none'>
    <Rect x='134' y='102' width='98' height='241' fill='#D9D9D9' />
    <Path d='M134 102H232V343H134V102Z' fill='#A259FF' />
    <Rect
      x='153'
      y='250'
      width='73'
      height='192'
      rx='36.5'
      transform='rotate(-90 153 250)'
      fill='#1ABCFE'
    />
    <Path
      d='M365 110.552C365 171.608 211.163 150.888 290.322 53.2839C268.223 53.2839 256.093 90.1308 232.073 106.07C186.458 136.338 133 150.547 133 110.552C133 49.4956 184.935 0 249 0C313.065 0 365 49.4956 365 110.552Z'
      fill='#F24D1F'
    />
    <Path
      d='M0 337.448C0 276.392 153.837 297.112 74.6781 394.716C96.7769 394.716 108.907 357.869 132.927 341.93C178.542 311.662 232 297.453 232 337.448C232 398.504 180.065 448 116 448C51.935 448 0 398.504 0 337.448Z'
      fill='#0ECF82'
    />
  </Svg>
)

export const LogoItem = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: 250,
    }}
  >
    <Logo />
  </View>
)
