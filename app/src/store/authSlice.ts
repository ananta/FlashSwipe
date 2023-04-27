import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { StateCreator } from 'zustand'

import { loginUser, registerUser } from '../api'

export interface IUserCredentials {
  username: string
  password: string
}
export interface IUserProfile {
  first_name: string
  last_name: string
}

export interface IUserInfo
  extends Omit<IUserCredentials, 'password'>,
    IUserProfile {
  user_id: string
  token: string
}

export interface IAuthSlice {
  user: IUserInfo
  isLoading: boolean
  error: string
  login: (credentials: IUserCredentials) => void
  register: (credentials: IUserCredentials & IUserProfile) => void
  logout: ({ cleanUp }: { cleanUp: () => void }) => void
  isLoggedIn: boolean
  isSuccess: boolean
}

const initialUserState: IUserInfo = {
  user_id: '',
  username: '',
  token: '',
  first_name: '',
  last_name: '',
}

export const createAuthSlice: StateCreator<IAuthSlice> = (set) => ({
  user: {
    ...initialUserState,
  },
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
  error: '',
  login: async (credentials) => {
    try {
      set({ isLoading: true })
      const data = await loginUser(credentials)
      set((state) => ({
        ...state,
        isLoading: false,
        isLoggedIn: true,
        isSuccess: true,
        user: {
          ...data,
        },
      }))
      Toast.show({
        type: 'success',
        text1: '👋 Logged in!',
      })
    } catch (err: any) {
      set({
        error: err?.message || 'Something went wrong',
        isLoading: false,
        isSuccess: false,
      })
      Toast.show({
        type: 'error',
        text1: err.message || 'Something went wrong',
      })
    }
  },
  register: async (credentials) => {
    try {
      set({ isLoading: true })
      console.log({ credentials })
      const data = await registerUser(credentials)
      set((state) => ({
        ...state,
        isLoading: false,
        isLoggedIn: false,
        isSuccess: true,
        user: {
          ...data,
        },
      }))
      Toast.show({
        type: 'success',
        text1: '✅ Account created',
      })
    } catch (err: any) {
      console.log({ err })
      set({
        error: err?.message || 'Something went wrong',
        isLoading: false,
        isSuccess: false,
      })
      Toast.show({
        type: 'error',
        text1: err.message || 'Something went wrong',
      })
    }
  },
  logout: ({ cleanUp }) => {
    set({
      user: initialUserState,
      isLoading: false,
      isLoggedIn: false,
      error: '',
    })
    cleanUp()
  },
})
