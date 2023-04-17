import { AxiosRequestConfig } from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { useStore } from 'store'

type UseAuthQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryFn'
> & {
  onSuccess?: (data: TData) => void
}

export const useAuthQuery = <
  TQueryKey extends [string, Record<string, unknown>?],
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: TQueryKey,
  queryFn: (params: TQueryKey[1], config: AxiosRequestConfig) => Promise<TData>,
  config?: UseAuthQueryOptions<TData, TError>
) => {
  const { token } = useStore((state) => state.user)

  //gets the axios reference
  // injects the corrrect  creds
  // make a request

  const authQueryFn = async (axiosConfig: AxiosRequestConfig) => {
    if (!token) {
      throw new Error('No token available')
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    return queryFn(queryKey[1], { ...axiosConfig, headers })
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
