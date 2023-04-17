import React, { Fragment } from 'react'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { Button, Input, YStack, Label, SizableText } from 'tamagui'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useStore } from 'store'
import { createDeck } from 'api'
import { IDeck, IDeckInfo } from 'store/deckSlice'
import useAuthMutation from 'hooks/useAuthMutation'
import { RootStackParamList } from 'types/NavTypes'

type AddDecksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Add Deck'
>

const AddDecksScreen: React.FC<AddDecksScreenProps> = ({ navigation }) => {
  const { createDeck: addDeckToState } = useStore((state) => state)

  const [addDeck] = useAuthMutation<IDeck, unknown, IDeckInfo>(createDeck, {
    onSuccess: (data: IDeck) => {
      console.log({ data })
      addDeckToState(data)
      Toast.show({
        type: 'success',
        text1: '✅ Deck created',
      })
      navigation.goBack()
      console.log('Mutation succeeded!', data)
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<IDeckInfo>({
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const handleAddDeck: SubmitHandler<IDeckInfo> = (deckInfo) =>
    addDeck(deckInfo)
  return (
    <YStack p='$3' space='$2'>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Fragment>
            <Label>Title</Label>
            <Input
              ref={ref}
              borderWidth={2}
              onBlur={onBlur}
              onChangeText={onChange}
              disabled={false}
              value={value}
              autoCapitalize='sentences'
              returnKeyType='next'
              returnKeyLabel='next'
              onSubmitEditing={() => setFocus('description')}
            />
            {errors.title && (
              <SizableText size='$3' theme='alt1' color='red'>
                This is required
              </SizableText>
            )}
          </Fragment>
        )}
        name='title'
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Fragment>
            <Label htmlFor='name'>Description</Label>
            <Input
              ref={ref}
              multiline
              onBlur={onBlur}
              numberOfLines={6}
              borderWidth={2}
              onChangeText={onChange}
              disabled={false}
              value={value}
              autoCapitalize='none'
              returnKeyType='done'
            />
            {errors.description && (
              <SizableText size='$3' theme='alt1' color='red'>
                This is required
              </SizableText>
            )}
          </Fragment>
        )}
        name='description'
      />
      <Button theme='purple' mt='$2' onPress={handleSubmit(handleAddDeck)}>
        Add Deck
      </Button>
    </YStack>
  )
}

export default AddDecksScreen
