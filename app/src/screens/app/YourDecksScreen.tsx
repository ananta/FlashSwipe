import React from 'react'
import { FlatList } from 'react-native'
import { H6, XStack, YStack } from 'tamagui'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useStore } from 'store'
import { RootStackParamList } from 'types/NavTypes'
import { ListCard } from 'components/ListCard'

type YourDecksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Your Decks'
>

const YourDeckScreen: React.FC<YourDecksScreenProps> = ({ navigation }) => {
  const { decks } = useStore()
  const tabHeight = useBottomTabBarHeight()
  return (
    <YStack>
      <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
        <XStack justifyContent='space-between'>
          <H6 fontWeight='$2' size='$5'>
            Your Decks
          </H6>
        </XStack>
      </XStack>
      <XStack>
        <FlatList
          data={decks}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: tabHeight + 10 }}
          renderItem={({ item, index }) => (
            <ListCard
              key={index.toString()}
              title={item.title}
              subTitle={item.description}
              animation='bouncy'
              size='$3'
              h={100}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
              onPress={() =>
                navigation.navigate('Deck Info', {
                  deck_id: item.deck_id,
                })
              }
            />
          )}
        />
      </XStack>
    </YStack>
  )
}

export default YourDeckScreen
