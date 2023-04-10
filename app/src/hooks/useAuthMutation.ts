import { UseMutationOptions } from '@tanstack/react-query'

import { AxiosRequestConfig } from 'axios'
import { useStore } from 'store'

type UseAuthMutationOptions<TData, TError> = Omit<
  UseMutationOptions<TData, TError>,
  'mutationFn'
> & {
  onSuccess?: (data: TData) => void
}

const useAuthMutation = <TData = unknown, TError = unknown, TParams = unknown>(
  mutationFn: (params: TParams, config: AxiosRequestConfig) => Promise<TData>,
  config?: UseAuthMutationOptions<TData, TError>
) => {
  const { token } = useStore((state) => state.user)

  const authMutationFn = async (params: TParams) => {
    if (!token) {
      throw new Error('No token available')
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const axiosConfig: AxiosRequestConfig = {
      headers,
    }

    return mutationFn(params, axiosConfig)
      .then((data) => {
        config?.onSuccess?.(data)
        return data
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }

  const mergedConfig: UseMutationOptions<TData, TError> = {
    ...config,
  }

  return [authMutationFn]
}

export default useAuthMutation
