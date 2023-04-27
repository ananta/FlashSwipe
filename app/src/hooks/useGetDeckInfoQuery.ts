import { AxiosResponse } from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from 'api'
import { IDeckWithCards } from 'store/deckSlice'
import { useStore } from 'store'

export const useGetDeckInfoQuery = ({ deck_id }: { deck_id: string }) => {
  const {
    user: { token },
  } = useStore((store) => store)

  const queryClient = useQueryClient()

  return useQuery<
    { data: { deck: IDeckWithCards } },
    unknown,
    AxiosResponse<{ deck: IDeckWithCards }>
  >({
    queryKey: ['my-decks', deck_id],
    queryFn: () => {
      return api.get(`/decks/${deck_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: (deckInfo) => {
      const { title, description, cards, deck_id } = deckInfo.data.deck
      queryClient.setQueryData(['my-decks', deck_id, 'info'], {
        title,
        description,
        deck_id,
      })
      queryClient.setQueryData(['my-decks', deck_id, 'cards'], cards)
    },
    onError: (_) => {
      // TODO
    },
  })
}
