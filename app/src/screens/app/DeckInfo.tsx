import React, { Fragment, useState } from 'react'
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
} from 'tamagui'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { ICard, ICardInfo } from 'store/deckSlice'
import { ListCard, ListCardActionContainer } from 'components/ListCard'
import { Button } from 'components/Button'
import { ActionCard } from 'components/ActionCard'
import { RootStackParamList } from 'types/NavTypes'
import { useAuthQuery } from 'hooks/useAuthQuery'
import useAuthMutation from 'hooks/useAuthMutation'
import { addCardToDeck, getDeckInfo, removeCardFromDeck } from 'api'

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
  const { data, isLoading, isError, refetch } = useAuthQuery(
    ['deck', { deck_id }],
    getDeckInfo,
    {
      onError(_) {
        console.log('Failed getting deck info')
        Toast.show({
          type: 'error',
          text1: 'Failed getting Decks',
        })
      },
    }
  )

  // TODO: Create a separate component

  const [position, setPosition] = useState(0)
  const [addCardModalOpen, setAddCardModalOpen] = useState(false)
  const [innerOpen, setInnerOpen] = useState(false)

  const [addCard] = useAuthMutation<
    ICard,
    unknown,
    ICardInfo & { deck_id: number }
  >(addCardToDeck, {
    onSuccess: (data: ICard) => {
      refetch()
      Toast.show({
        type: 'success',
        text1: '✅ Card Added',
      })
      setAddCardModalOpen(false)
    },
  })

  const [removeCard] = useAuthMutation<
    unknown,
    unknown,
    { deck_id: number; card_id: number }
  >(removeCardFromDeck, {
    onSuccess: () => {
      refetch()
      Toast.show({
        type: 'success',
        text1: '✅ Card Removed',
      })
    },
  })

  const handleCreateCard: SubmitHandler<ICardInfo> = (cardInfo) => {
    addCard({ ...cardInfo, deck_id })
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ICardInfo>({
    defaultValues: {
      front: '',
      back: '',
    },
  })

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
            title={data?.deck.title || '--'}
            subTitle={data?.deck.description || '--'}
            animation='bouncy'
            size='$5'
            h={200}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
          >
            {data?.deck && (
              <Button
                br='$10'
                theme='gray'
                onPress={() =>
                  navigation.navigate('Swipe Screen', {
                    deck: data.deck,
                  })
                }
                color='white'
                disabled={isLoading || isError}
              >
                Start swiping
              </Button>
            )}

            <Button
              br='$10'
              ml='$2'
              theme='gray'
              onPress={() => setAddCardModalOpen(true)}
              color='white'
              disabled={isLoading || isError}
            >
              Add Card
            </Button>
          </ActionCard>
        </XStack>
        <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$4' space>
          <XStack justifyContent='space-between'>
            <H6 fontWeight='$2' size='$5'>
              Cards
            </H6>
          </XStack>
        </XStack>
        <XStack space style={{ flex: 1 }}>
          <FlatList
            data={data?.deck.cards || []}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
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

      <Sheet
        forceRemoveScrollEnabled={addCardModalOpen}
        modal
        open={addCardModalOpen}
        onOpenChange={setAddCardModalOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
            /* isLoading={true} */
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

      <Sheet
        forceRemoveScrollEnabled={addCardModalOpen}
        modal
        open={addCardModalOpen}
        onOpenChange={setAddCardModalOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
            /* isLoading={true} */
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
