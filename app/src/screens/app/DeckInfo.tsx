import React, { Fragment, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import {
  H6,
  XStack,
  YStack,
  H4,
  Paragraph,
  Sheet,
  Label,
  Input,
  SizableText,
  H3,
  Spinner,
} from 'tamagui'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import uuid from 'react-native-uuid'
import { useQueryClient } from '@tanstack/react-query'

import { ICard, ICardInfo, IDeckInfo } from 'store/deckSlice'
import { ListCard, ListCardActionContainer } from 'components/ListCard'
import { Button } from 'components/Button'
import { ActionCard } from 'components/ActionCard'
import { RootStackParamList } from 'types/NavTypes'
import { useAddCardToDeckMutation } from 'hooks/useAddCardToDeck'
import { useGetDeckInfoQuery } from 'hooks/useGetDeckInfoQuery'
import { useRemoveCardFromMutation } from 'hooks/useRemoveCardMutation'
import { EmptyItem } from 'components/EmptyItem'
import { useUpdateDeckMutation } from 'hooks/useUpdateDeckMutation'

// TODO: File's too big & I've exams :()

type DeckInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Deck Info'
>

const DeckInfoScreen: React.FC<DeckInfoScreenProps> = ({
  navigation,
  route: {
    params: { deck_id },
  },
}) => {
  useGetDeckInfoQuery({ deck_id })

  const [position, setPosition] = useState(0)
  const [addCardModalOpen, setAddCardModalOpen] = useState(false)
  const [updateDeckModalOpen, setUpdateDeckModalOpen] = useState(false)
  const [innerOpen, setInnerOpen] = useState(false)

  const queryClient = useQueryClient()

  const info = queryClient.getQueryData<{
    title: string
    description: string
  }>(['my-decks', deck_id, 'info'])
  const cards: ICard[] =
    queryClient.getQueryData(['my-decks', deck_id, 'cards']) || []

  console.log({ here: cards })

  const {
    mutate: addCard,
    isSuccess: isAddCardSuccess,
    isLoading: isAddingCard,
    isPaused: isAddingPaused,
    status,
  } = useAddCardToDeckMutation()

  const { mutate: removeCard } = useRemoveCardFromMutation()

  const {
    mutate: updateDeck,
    isSuccess: isUpdateDeckSuccess,
    isLoading: isUpdateDeckLoading,
    isPaused: isUpdateDeckPaused,
  } = useUpdateDeckMutation()

  const handleUpdateDeck: SubmitHandler<IDeckInfo> = (deckInfo) => {
    // call the mutation
    updateDeck({
      deck_id,
      ...deckInfo,
    })
  }

  const handleCreateCard: SubmitHandler<ICardInfo> = (cardInfo) => {
    const card_id = uuid.v4().toString()
    addCard({ ...cardInfo, deck_id, card_id })
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset: resetForm,
  } = useForm<ICardInfo>({
    defaultValues: {
      front: '',
      back: '',
    },
  })

  console.log({ info })

  const title = info?.title || 'undefined'
  const description = info?.description || 'undefined'
  const {
    control: updateControl,
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
    setFocus: setUpdateFocus,
    reset: resetUpdateForms,
  } = useForm<IDeckInfo>({
    defaultValues: {
      title,
      description,
    },
  })

  useEffect(() => {
    if (isUpdateDeckPaused || isUpdateDeckSuccess) {
      Toast.show({
        type: 'success',
        text1: '✅ Deck Updated',
      })
      setUpdateDeckModalOpen(false)
      resetUpdateForms()
    }
  }, [isUpdateDeckPaused, isUpdateDeckSuccess, isUpdateDeckLoading, updateDeck])

  useEffect(() => {
    if (isAddingPaused || isAddCardSuccess) {
      Toast.show({
        type: 'success',
        text1: '✅ Card Added',
      })
      setAddCardModalOpen(false)
      resetForm()
    }
  }, [isAddingPaused, isAddCardSuccess, isAddingCard, addCard, status, cards])

  return (
    <>
      <YStack flex={1}>
        <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
          <XStack justifyContent='space-between'>
            <H6 fontWeight='$2' size='$5'>
              Deck Info
            </H6>
          </XStack>
        </XStack>
        <XStack $sm={{ flexDirection: 'column' }} space>
          <ActionCard
            title={title}
            subTitle={description}
            animation='bouncy'
            size='$5'
            h={200}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
          >
            {cards && (
              <Button
                br='$10'
                theme='gray'
                disabled={!(cards.length > 0)}
                onPress={() =>
                  navigation.navigate('Swipe Screen', {
                    deck: {
                      deck_id,
                      title,
                      description,
                      cards,
                    },
                  })
                }
                color='white'
                /* disabled={isLoading || isError} */
              >
                Start swiping
              </Button>
            )}
            <Button
              br='$10'
              ml='$2'
              theme='gray'
              onPress={() => {
                setAddCardModalOpen(true)
                setFocus('front')
              }}
              color='white'
            >
              Add Card
            </Button>
            <Button
              br='$10'
              ml='$2'
              theme='gray'
              onPress={() => {
                setUpdateDeckModalOpen(true)
                setUpdateFocus('title')
              }}
              color='white'
            >
              Update Deck
            </Button>
          </ActionCard>
        </XStack>
        <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
          <XStack justifyContent='space-between'>
            <H6 fontWeight='$2' size='$5'>
              Cards
            </H6>
            {isAddingCard && (
              <YStack alignItems='center'>
                <Spinner size='small' color='$purple10' />
              </YStack>
            )}
          </XStack>
        </XStack>
        <XStack flex={1}>
          <FlatList
            data={cards || []}
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyItem}
            renderItem={({ item }) => (
              <ListCard
                key={item.card_id}
                renderRightActions={() => (
                  <ListCardActionContainer
                    onPress={() =>
                      removeCard({
                        deck_id,
                        card_id: item.card_id,
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name='trash-can'
                      size={30}
                      color='white'
                    />
                  </ListCardActionContainer>
                )}
                title={item.front}
                subTitle={item.back}
                animation='bouncy'
                size='$3'
                h={100}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
              />
            )}
          />
        </XStack>
      </YStack>
      {/* UPDATE DECK */}
      <Sheet
        modal
        open={updateDeckModalOpen}
        onOpenChange={setUpdateDeckModalOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        forceRemoveScrollEnabled
        position={position}
        onPositionChange={setPosition}
        moveOnKeyboardChange
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4' backgroundColor={'black'}>
          <H3 marginVertical='$4'>Update Deck</H3>
          <Controller
            control={updateControl}
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
                  value={value}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  onSubmitEditing={() => setUpdateFocus('description')}
                />
                {updateErrors.title && (
                  <SizableText size='$3' theme='alt1' color='red'>
                    This is required
                  </SizableText>
                )}
              </Fragment>
            )}
            name='title'
          />

          <Controller
            control={updateControl}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Fragment>
                <Label>Description</Label>
                <Input
                  ref={ref}
                  borderWidth={2}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  onSubmitEditing={handleUpdateSubmit(handleUpdateDeck)}
                />
                {updateErrors.description && (
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
            color='white'
            mt='$5'
            onPress={handleUpdateSubmit(handleUpdateDeck)}
          >
            Update Deck
          </Button>
        </Sheet.Frame>
      </Sheet>

      <Sheet
        modal
        open={addCardModalOpen}
        onOpenChange={setAddCardModalOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        forceRemoveScrollEnabled
        position={position}
        onPositionChange={setPosition}
        moveOnKeyboardChange
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4' backgroundColor={'black'}>
          <H3 marginVertical='$4'>Add Card </H3>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Fragment>
                <Label>Front</Label>
                <Input
                  ref={ref}
                  borderWidth={2}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={isAddingCard}
                  value={value}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  onSubmitEditing={() => setFocus('back')}
                />
                {errors.front && (
                  <SizableText size='$3' theme='alt1' color='red'>
                    This is required
                  </SizableText>
                )}
              </Fragment>
            )}
            name='front'
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Fragment>
                <Label>Back</Label>
                <Input
                  ref={ref}
                  borderWidth={2}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={isAddingCard}
                  value={value}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  onSubmitEditing={handleSubmit(handleCreateCard)}
                />
                {errors.back && (
                  <SizableText size='$3' theme='alt1' color='red'>
                    This is required
                  </SizableText>
                )}
              </Fragment>
            )}
            name='back'
          />

          <Button
            theme='purple'
            color='white'
            mt='$5'
            onPress={handleSubmit(handleCreateCard)}
          >
            Add Card
          </Button>

          <>
            <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />

            <Button color='white' mt='$2' onPress={() => setInnerOpen(true)}>
              <MaterialCommunityIcons
                name='chevron-down'
                size={30}
                color='white'
              />
            </Button>
          </>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

const InnerSheet = ({ ...props }) => {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame
        flex={1}
        justifyContent='center'
        alignItems='center'
        space='$5'
      >
        <Sheet.ScrollView padding='$4' space>
          <Button
            size='$8'
            circular
            alignSelf='center'
            icon={
              <MaterialCommunityIcons
                name='chevron-down'
                size={30}
                color='white'
              />
            }
            onPress={() => props.onOpenChange?.(false)}
          />
          <H3>Information</H3>
          <H4>Add Card</H4>
          <Paragraph size='$6'>You can add card inside the deck</Paragraph>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

export default DeckInfoScreen
