import React from 'react'
import { ScrollView } from 'react-native'
import { XStack, YStack, Button } from 'tamagui'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { QuickActions } from 'features/navigation'
import { YourDecksHorizontal } from 'features/decks'
import { ActionCard } from 'components/ActionCard'
import { RootStackParamList } from 'types/NavTypes'

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack>
        <XStack $sm={{ flexDirection: 'column' }} space pt='$4'>
          <ActionCard
            title='Flash Swipe'
            subTitle='Ready to learn something new ?'
            animation='bouncy'
            size='$5'
            h={200}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
          >
            <Button
              br='$10'
              theme='gray'
              color='white'
              onPress={() => navigation.navigate('Add Deck')}
            >
              Create a deck now!
            </Button>
          </ActionCard>
        </XStack>
        <YourDecksHorizontal />
        <QuickActions />
      </YStack>
    </ScrollView>
  )
}

export default DashboardScreen
