import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useStore } from 'store'
import { api } from 'api'
import { IDeck, IDeckInfo } from 'store/deckSlice'

export const useUpdateDeckMutation = () => {
  const queryClient = useQueryClient()
  const {
    user: { token },
  } = useStore((store) => store)

  return useMutation<IDeck, unknown, IDeck>({
    mutationFn: ({
      title,
      description,
      deck_id,
    }: IDeckInfo & { deck_id: string }) => {
      return api.put(
        `/decks/${deck_id}`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    },
    onMutate: async (newDeck) => {
      await queryClient.cancelQueries({
        queryKey: ['my-decks', newDeck.deck_id],
      })
      const oldDeck = queryClient.getQueryData<IDeck>([
        'my-decks',
        newDeck.deck_id,
      ])
      queryClient.setQueryData<IDeck[]>(['my-decks'], (old) => {
        if (old && old.length > 0) {
          const cardIndex = old.findIndex(
            (item) => item.deck_id === newDeck.deck_id
          )
          old[cardIndex] = newDeck
          return old
        }
      })
      queryClient.setQueryData<IDeck>(
        ['my-decks', newDeck.deck_id, 'info'],
        (_) => {
          return newDeck
        }
      )
      return oldDeck
    },
    onError: (__, _, context) => {
      queryClient.setQueryData(['my-decks'], (context as any)?.oldDeck)
      Toast.show({
        type: 'error',
        text1: '⛔︎ Cannot create deck',
      })
    },
    onSettled: (deck) => {
      queryClient.invalidateQueries({ queryKey: ['my-decks', deck?.deck_id] })
    },
    onSuccess: (newDeck: IDeck) => {
      queryClient.setQueryData(['my-decks', newDeck.deck_id, 'info'], newDeck)
    },
  })
}
