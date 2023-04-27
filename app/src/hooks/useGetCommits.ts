import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from 'api'
import { AxiosResponse } from 'axios'
import { useStore } from 'store'

interface ICommitInfo {
  count: number
  date: Date
}

export const useGetCommits = () => {
  const {
    user: { token },
  } = useStore((store) => store)

  return useQuery<
    { data: ICommitInfo[] },
    unknown,
    AxiosResponse<ICommitInfo[]>
  >({
    queryKey: ['my-commits'],
    queryFn: () => {
      return api.get(`/commits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
  })
}
