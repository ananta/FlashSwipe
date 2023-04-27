import React from 'react'
import { Button, XStack, YStack, Label, Text, Stack } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'

import { useStore } from 'store'
import OfflineSimulator from 'components/OfflineSimulator'
import { LogoItem } from 'components/Logo'

const ProfileScreen = () => {
  const { logout, user } = useStore()
  const queryClient = useQueryClient()

  const cleanUp = async () => {
    await queryClient.invalidateQueries()
    queryClient.removeQueries()
  }

  return (
    <YStack pt='$4'>
      <XStack flexDirection='row' alignItems='center' justifyContent='center'>
        <LogoItem />
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
