import React from 'react'
import { Button, XStack, YStack, Label, Avatar, Text, Stack } from 'tamagui'

import { useStore } from 'store'

const ProfileScreen = () => {
  const { logout, user } = useStore()
  return (
    <YStack pt='$10'>
      <XStack
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
        space='$6'
        pt='$10'
      >
        <Avatar circular size='$10'>
          <Avatar.Fallback backgroundColor='$purple10' />
        </Avatar>
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
        <Button theme='purple_alt1' onPress={logout}>
          Logout
        </Button>
      </XStack>
    </YStack>
  )
}

export default ProfileScreen
