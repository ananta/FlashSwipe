import { AxiosRequestConfig } from 'axios'
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { useStore } from 'store'

type UseAuthQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryFn'
> & {
  onSuccess?: (data: TData) => void
}

export const useAuthQuery = <TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: (config: AxiosRequestConfig) => Promise<TData>,
  config?: UseAuthQueryOptions<TData, TError>
) => {
  const { token } = useStore((state) => state.user)

  const authQueryFn = async (axiosConfig: AxiosRequestConfig) => {
    if (!token) {
      throw new Error('No token available')
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    return queryFn({ ...axiosConfig, headers })
  }

  const mergedConfig = config
    ? {
        ...config,
        onSuccess: (data: TData) => {
          if (config?.onSuccess) {
            config?.onSuccess(data)
          }
          useStore.setState((state) => ({
            ...state,
            data,
          }))
        },
      }
    : {
        onSuccess: (data: TData) => {
          useStore.setState((state) => ({
            ...state,
            data,
          }))
        },
      }

  return useQuery<TData, TError>(queryKey, authQueryFn, mergedConfig)
}
