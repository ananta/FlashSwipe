import { Fragment } from 'react'
import { FlatList } from 'react-native'
import { H6, Paragraph, XStack, Card, H1, H4 } from 'tamagui'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'

import { GridCard } from 'components/GridCard'
import { RootStackParamList } from 'types/NavTypes'
import { IDeck } from 'store/deckSlice'
import { useMyDecksQuery } from 'hooks/useGetDeckQuery'

/**
 * Shows Decks in Horizontal **FlatList**
 */
const YourDecksHorizontal = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  useMyDecksQuery()
  const queryClient = useQueryClient()
  const data: IDeck[] | undefined = queryClient.getQueryData(['my-decks'])
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
          data={data || []}
          ListEmptyComponent={() => (
            <XStack minWidth='100%' justifyContent='center'>
              <Card
                height='$10'
                backgroundColor={'black'}
                size='$3'
                mt='$4'
                p='$4'
              >
                <Card.Header
                  padded
                  alignItems='center'
                  justifyContent='center'
                  height='100%'
                >
                  <H1>🏜</H1>
                  <H4>empty..</H4>
                  <Paragraph theme='alt2'>💨💨💨💨💨</Paragraph>
                </Card.Header>
              </Card>
            </XStack>
          )}
          renderItem={({ item }) => (
            <GridCard
              animation='bouncy'
              size='$3'
              h={150}
              w={270}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
              onPress={() => navigation.navigate('Deck Info', item)}
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
