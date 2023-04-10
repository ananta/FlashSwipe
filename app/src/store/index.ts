import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { createAuthSlice, IAuthSlice } from './authSlice'
import { createDeckSlice, IDeckSlice } from './deckSlice'

interface IStore extends IAuthSlice, IDeckSlice {}

export const useStore = create(
  persist<IStore>(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createDeckSlice(set, get, api),
    }),
    {
      name: 'flashswipe-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
