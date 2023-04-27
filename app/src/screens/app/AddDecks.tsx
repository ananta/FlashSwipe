import React, { Fragment, useEffect } from 'react'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { Input, YStack, Label, SizableText } from 'tamagui'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import uuid from 'react-native-uuid'

import { IDeckInfo } from 'store/deckSlice'
import { Button } from 'components/Button'
import { RootStackParamList } from 'types/NavTypes'
import { useAddDeckMutation } from 'hooks/useAddDeckMutation'

type AddDecksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Add Deck'
>

const AddDecksScreen: React.FC<AddDecksScreenProps> = ({ navigation }) => {
  const {
    mutate: addDeck,
    isSuccess,
    isLoading,
    isPaused,
  } = useAddDeckMutation()

  useEffect(() => {
    if (isSuccess || isPaused) {
      navigation.goBack()
      Toast.show({
        type: 'success',
        text1: '✅ Deck created',
      })
    }
  }, [isSuccess, isPaused])

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

  const handleAddDeck: SubmitHandler<IDeckInfo> = (deckInfo) => {
    const newDeck = {
      title: deckInfo.title,
      description: deckInfo.description,
      deck_id: uuid.v4().toString(),
    }
    console.log({ newDeck })
    return addDeck({
      title: newDeck.title,
      description: newDeck.description,
      deck_id: newDeck.deck_id,
    })
  }

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
      <Button
        theme='purple'
        mt='$2'
        onPress={handleSubmit(handleAddDeck)}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Add Deck
      </Button>
    </YStack>
  )
}

export default AddDecksScreen
