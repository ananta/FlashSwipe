import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useStore } from 'store'
import { api } from 'api'

export const useAddCommitsMutation = () => {
  const {
    user: { token },
  } = useStore((store) => store)

  const queryClient = useQueryClient()

  return useMutation<void, unknown, void>({
    mutationFn: () => {
      return api.post(
        `/commits`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-commits'])
    },
  })
}
