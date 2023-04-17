import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { H6, XStack, YGroup, ListItem, Separator } from 'tamagui'
import { RootStackParamList } from 'types/NavTypes'

const QuickActions = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
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
              onPress={() => navigation.navigate('Add Deck')}
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
              onPress={() => navigation.navigate('Your Decks')}
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
                <MaterialCommunityIcons name='eye' color={'white'} size={20} />
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
  )
}

export default QuickActions
