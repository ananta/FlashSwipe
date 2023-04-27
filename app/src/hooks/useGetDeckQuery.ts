import { AxiosResponse } from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from 'api'
import { IDeck } from 'store/deckSlice'
import { useStore } from 'store'

export const useMyDecksQuery = () => {
  const {
    user: { token },
  } = useStore((store) => store)

  const queryClient = useQueryClient()

  return useQuery<{ data: IDeck[] }, unknown, IDeck[]>({
    queryKey: ['my-decks'],
    queryFn: () => {
      return api.get(`/decks/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: (myDecksResponse) => {
      queryClient.setQueryData(['my-decks'], myDecksResponse.data)
      myDecksResponse.data.map((deck) => {
        queryClient.setQueryData(['my-decks', deck.deck_id, 'info'], {
          ...deck,
        })
      })
    },
  })
}
