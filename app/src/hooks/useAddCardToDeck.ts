import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useStore } from 'store'
import { api } from 'api'
import { ICard, ICardInfo } from 'store/deckSlice'

export const useAddCardToDeckMutation = () => {
  const queryClient = useQueryClient()
  const {
    user: { token },
  } = useStore((store) => store)

  return useMutation<
    ICard,
    unknown,
    ICardInfo & { deck_id: string; card_id: string }
  >({
    mutationFn: ({ front, back, deck_id, card_id }) => {
      return api.post(
        `/decks/${deck_id}/cards`,
        {
          card_id,
          front,
          back,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    },
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({
        queryKey: ['my-decks', newCard.deck_id, 'cards'],
      })

      const cardsBeforeMutation = queryClient.getQueryData<ICard[]>([
        'my-decks',
        newCard.deck_id,
        'cards',
      ])
      queryClient.setQueryData<ICard[]>(
        ['my-decks', newCard.deck_id, 'cards'],
        (old) => {
          if (old && old.length > 0) {
            return [newCard, ...(old as any)]
          }
          return [newCard]
        }
      )
      return { deck_id: newCard.deck_id, cardsBeforeMutation }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ['my-decks', (context as any).deck_id, 'cards'],
        (context as any)?.cardsBeforeMutation
      )
      Toast.show({
        type: 'error',
        text1: '⛔︎ Cannot create a card',
      })
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['my-decks', data?.deck_id, 'cards'],
      })
    },
    onSuccess: (newCard: ICard) => {
      const cacheData: ICard[] =
        queryClient.getQueryData(['my-decks', newCard.deck_id, 'cards']) || []
      queryClient.setQueryData(
        ['my-decks', newCard.deck_id, 'cards'],
        [newCard, ...cacheData]
      )
    },
  })
}
