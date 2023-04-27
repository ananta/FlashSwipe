import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useStore } from 'store'
import { api } from 'api'
import { IDeck, IDeckIdentifier, IDeckInfo } from 'store/deckSlice'

export const useAddDeckMutation = () => {
  const queryClient = useQueryClient()
  const {
    user: { token },
  } = useStore((store) => store)

  return useMutation<IDeck, unknown, IDeckInfo & IDeckIdentifier>({
    mutationFn: ({
      title,
      description,
      deck_id,
    }: IDeckInfo & { deck_id: string }) => {
      return api.post(
        '/decks',
        {
          deck_id,
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
        queryKey: ['my-decks'],
      })
      const decksBeforeMutation = queryClient.getQueryData<IDeck[]>([
        'my-decks',
      ])
      queryClient.setQueryData<IDeck[]>(['my-decks'], (old) => {
        return [...(old as any), newDeck]
      })
      queryClient.setQueryData(['my-decks', newDeck.deck_id, 'info'], newDeck)
      return { decksBeforeMutation }
    },
    onError: (__, _, context) => {
      queryClient.setQueryData(
        ['my-decks'],
        (context as any)?.decksBeforeMutation
      )
      Toast.show({
        type: 'error',
        text1: '⛔︎ Cannot create deck',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-decks'] })
    },
    onSuccess: (newDeck: IDeck) => {
      queryClient.setQueryData(['my-decks', newDeck.deck_id, 'info'], newDeck)
    },
  })
}
