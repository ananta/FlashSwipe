import { StateCreator } from 'zustand'

import { Toast } from 'react-native-toast-message/lib/src/Toast'

import {
  createDeck,
  getDeckInfo,
  myDecks,
  allDecks,
  updateDeck,
  removeDeck,
  addCardToDeck,
  removeCardFromDeck,
} from 'api'

export interface IDeckInfo {
  title: string
  description: string
}

export interface ICardInfo {
  front: string
  back: string
}
export interface ICard extends ICardInfo {
  card_id: number
  deck_id: number
  published_on: Date
}

export interface IDeck extends IDeckInfo {
  deck_id: number
  published_by: number
  published_on: Date
}

export interface IDeckWithCards extends IDeck {
  cards: ICard[]
}

export interface IDeckSlice {
  decks: IDeck[]
  isLoading: boolean
  error: string
  createDeck: (deckInfo: IDeckInfo) => void
  setDecks: (decks: IDeck[]) => void
  isSuccess: boolean
}

export const createDeckSlice: StateCreator<IDeckSlice> = (set) => ({
  decks: [],
  isLoading: false,
  isSuccess: false,
  error: '',
  createDeck: async (deckInfo) => {
    try {
      set({ isLoading: true })
      /* const data = await loginUser(credentials) */
      set((state) => ({
        ...state,
        isLoading: false,
        isSuccess: true,
        decks: [
          ...state.decks,
          {
            ...deckInfo,
            deck_id: 0,
            published_by: 0,
            published_on: new Date(),
          },
        ],
      }))
      Toast.show({
        type: 'success',
        text1: 'Deck created!',
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
  setDecks: (decks) => {
    set((state) => ({
      ...state,
      isLoading: false,
      isSuccess: true,
      decks,
    }))
  },
})
