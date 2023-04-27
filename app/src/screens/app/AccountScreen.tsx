import React from 'react'
import { Button, XStack, YStack, Label, Text, Stack } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'
import { ContributionGraph } from 'react-native-chart-kit'

import { useStore } from 'store'
import OfflineSimulator from 'components/OfflineSimulator'
import { Dimensions } from 'react-native'
import { useGetCommits } from 'hooks/useGetCommits'

const ProfileScreen = () => {
  const { logout, user } = useStore()
  const queryClient = useQueryClient()

  const { data } = useGetCommits()

  const cleanUp = async () => {
    await queryClient.invalidateQueries()
    queryClient.removeQueries()
  }

  const screenWidth = Dimensions.get('window').width

  const tomorrowDate = (): Date => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  console.log({ data })

  return (
    <YStack pt='$4'>
      <XStack flexDirection='row' alignItems='center' justifyContent='center'>
        {/* @ts-ignore */}
        <ContributionGraph
          /* tooltipDataAttrs={(val) => <Text>{val}</Text>} */
          values={data?.data || []}
          chartConfig={{
            backgroundColor: 'gray',
            backgroundGradientFrom: '#121111',
            backgroundGradientTo: '#121111',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            borderRadius: 0,
          }}
          endDate={tomorrowDate()}
          numDays={105}
          width={screenWidth}
          height={220}
        />
      </XStack>
      <XStack $sm={{ flexDirection: 'column' }} px='$4' space>
        <Stack margin={10}>
          <Label textAlign='center' fontWeight='$10' fontSize={'20'}>
            {user.first_name} {user.last_name}
          </Label>
          <Text textAlign='center' color={'white'}>
            @{user.username} | #{user.user_id}
          </Text>
        </Stack>
        <Button theme='gray' onPress={() => logout({ cleanUp })}>
          Logout
        </Button>
      </XStack>
      <OfflineSimulator />
    </YStack>
  )
}

export default ProfileScreen
