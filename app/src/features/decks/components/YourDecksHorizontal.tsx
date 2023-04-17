import { Fragment } from 'react'
import { FlatList } from 'react-native'
import { H6, Paragraph, XStack } from 'tamagui'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useStore } from 'store'
import { GridCard } from 'components/GridCard'
import { RootStackParamList } from 'types/NavTypes'

/**
 * Shows Decks in Horizontal **FlatList**
 */
const YourDecksHorizontal = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const { decks } = useStore()
  return (
    <Fragment>
      <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
        <XStack justifyContent='space-between'>
          <H6 fontWeight='$2' size='$5'>
            Your Decks
          </H6>
          <Paragraph
            fontWeight='$1'
            size='$5'
            onPress={() => navigation.navigate('Your Decks')}
          >
            View all
          </Paragraph>
        </XStack>
      </XStack>
      <XStack $sm={{ flexDirection: 'column' }} space>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={decks}
          renderItem={({ item }) => (
            <GridCard
              animation='bouncy'
              size='$3'
              h={150}
              w={270}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
              onPress={() =>
                navigation.navigate('Deck Info', {
                  deck_id: item.deck_id,
                })
              }
            >
              <H6>{item.title}</H6>
              <Paragraph theme='alt2'>{item.description}</Paragraph>
            </GridCard>
          )}
        />
      </XStack>
    </Fragment>
  )
}

export default YourDecksHorizontal
