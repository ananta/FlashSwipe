import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import {
  Button,
  Card,
  CardProps,
  H2,
  H6,
  Paragraph,
  XStack,
  YStack,
  Image,
  YGroup,
  ListItem,
  Separator,
} from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { myDecks } from 'api'
import { useStore } from 'store'
import { NavProps } from 'types/NavTypes'
import { useAuthQuery } from 'hooks/useAuthQuery'

function DemoCard(props: CardProps & { navigation: any }) {
  return (
    <Card theme='dark' elevate size='$3' bordered {...props}>
      <Card.Header padded>
        <H2>Flash Swipe</H2>
        <Paragraph theme='alt2'>Ready to learn something new ?</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack f={1} />
        <Button br='$10' onPress={() => props.navigation.navigate('Add Deck')}>
          Create a deck now!
        </Button>
      </Card.Footer>
    </Card>
  )
}

type DeckProp = {
  data: {
    title: string
    description: string
  }
}

type DeckCardProp = CardProps & DeckProp & { navigation: any }

function DeckCard(props: DeckCardProp) {
  return (
    <Card
      theme='dark'
      elevate
      size='$4'
      bordered
      {...props}
      onPress={() => props.navigation.navigate('Deck Info')}
    >
      <Card.Header padded>
        <H6>{props.data.title}</H6>
        <Paragraph theme='alt2'>{props.data.description}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
      </Card.Footer>
      <Card.Background>
        <Image
          position='absolute'
          width={300}
          height={300}
          resizeMode='contain'
          alignSelf='center'
          src='data:image/jpeg;base64,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'
        />
      </Card.Background>
    </Card>
  )
}

const DashboardScreen: React.FC<NavProps> = ({ navigation }) => {
  const { decks, setDecks } = useStore()
  useAuthQuery(['my-decks'], myDecks, {
    onSuccess: setDecks,
  })

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack>
        <XStack $sm={{ flexDirection: 'column' }} space pt='$4'>
          <DemoCard
            animation='bouncy'
            size='$5'
            h={200}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
            navigation={navigation}
          />
        </XStack>
        <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
          <XStack justifyContent='space-between'>
            <H6 fontWeight='$2' size='$5'>
              Your Decks
            </H6>
            <Paragraph
              fontWeight='$1'
              size='$5'
              onPress={() => (navigation as any).navigate('Your Decks')}
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
            renderItem={({ item, index }) => (
              <DeckCard
                navigation={navigation}
                data={item}
                animation='bouncy'
                size='$3'
                h={150}
                w={270}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
              />
            )}
          />
        </XStack>

        <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
          <XStack justifyContent='space-between'>
            <H6 fontWeight='$2' size='$5'>
              Quick Actions
            </H6>
          </XStack>
          <XStack>
            <YGroup
              alignSelf='center'
              bordered
              width='100%'
              size='$5'
              separator={<Separator />}
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  pressTheme
                  title='Create a deck'
                  onPress={() => (navigation as any).navigate('Add Deck')}
                  icon={
                    <MaterialCommunityIcons
                      name='plus-box'
                      color={'white'}
                      size={20}
                    />
                  }
                  iconAfter={
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={30}
                      color='white'
                    />
                  }
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  pressTheme
                  title='View your decks'
                  onPress={() => (navigation as any).navigate('Your Decks')}
                  icon={
                    <MaterialCommunityIcons
                      name='account'
                      color={'white'}
                      size={20}
                    />
                  }
                  iconAfter={
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={30}
                      color='white'
                    />
                  }
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  pressTheme
                  title='View public decks'
                  icon={
                    <MaterialCommunityIcons
                      name='eye'
                      color={'white'}
                      size={20}
                    />
                  }
                  iconAfter={
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={30}
                      color='white'
                    />
                  }
                />
              </YGroup.Item>
            </YGroup>
          </XStack>
        </XStack>
      </YStack>
    </ScrollView>
  )
}

export default DashboardScreen
