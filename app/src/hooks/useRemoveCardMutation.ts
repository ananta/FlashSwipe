import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { api } from 'api'
import { useStore } from 'store'
import { ICard } from 'store/deckSlice'

interface ICardAndDeckIdentity {
  deck_id: string
  card_id: string
}

export const useRemoveCardFromMutation = () => {
  const queryClient = useQueryClient()
  const {
    user: { token },
  } = useStore((store) => store)

  return useMutation<ICard, unknown, { deck_id: string; card_id: string }>({
    mutationFn: ({ deck_id, card_id }) => {
      return api.delete(`/decks/${deck_id}/cards/${card_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onMutate: async (cardToBeRemoved) => {
      await queryClient.cancelQueries({
        queryKey: ['my-decks', cardToBeRemoved.deck_id, 'cards'],
      })

      const cardsBeforeMutation = queryClient.getQueryData<ICard[]>([
        'my-decks',
        cardToBeRemoved.deck_id,
        'cards',
      ])
      queryClient.setQueryData<ICardAndDeckIdentity[]>(
        ['my-decks', cardToBeRemoved.deck_id, 'cards'],
        (old) => {
          if (old && old.length > 0) {
            const cardIndex = old.findIndex(
              (item) => item.card_id == cardToBeRemoved.card_id
            )
            old.splice(cardIndex, 1)
            return old
          }
          return old
        }
      )
      return { deck_id: cardToBeRemoved.deck_id, cardsBeforeMutation }
    },
    onError: (__, _, context) => {
      queryClient.setQueryData(
        ['my-decks', (context as any).deck_id, 'cards'],
        (context as any)?.cardsBeforeMutation
      )
      Toast.show({
        type: 'error',
        text1: '⛔︎ Cannot remove a card',
      })
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['my-decks', data?.deck_id, 'cards'],
      })
    },
    /* onSuccess: (_, cardToBeRemoved) => { */
    /*   const cacheData: ICard[] = */
    /*     queryClient.getQueryData([ */
    /*       'my-decks', */
    /*       cardToBeRemoved.deck_id, */
    /*       'cards', */
    /*     ]) || [] */
    /**/
    /*   const cardIndex = cacheData.findIndex( */
    /*     (item) => item.card_id == cardToBeRemoved.card_id */
    /*   ) */
    /*   cacheData.splice(cardIndex, 1) */
    /*   queryClient.setQueryData( */
    /*     ['my-decks', cardToBeRemoved.deck_id, 'cards'], */
    /*     cacheData */
    /*   ) */
    /* }, */
  })
}
