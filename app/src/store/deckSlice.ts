import { StateCreator } from 'zustand'

import { Toast } from 'react-native-toast-message/lib/src/Toast'

export interface IDeckIdentifier {
  deck_id: string
}
export interface IDeckInfo {
  title: string
  description: string
}

export interface ICardInfo {
  front: string
  back: string
}
export interface ICard extends ICardInfo, IDeckIdentifier {
  card_id: string
  published_on: Date
}

export interface IDeck extends IDeckInfo {
  deck_id: string
  published_by?: number
  published_on?: Date
}

export interface IDeckWithCards extends IDeck {
  cards: ICard[]
}

export interface IDeckSlice {
  decks: IDeck[]
  error: string
  createDeck: (deckInfo: IDeck) => void
  setDecks: (decks: IDeck[]) => void
}

export const createDeckSlice: StateCreator<IDeckSlice> = (set) => ({
  decks: [],
  error: '',
  createDeck: async (deckInfo) => {
    try {
      console.log('adding deck to the state')
      console.log({
        deckInfo,
      })
      /* const data = await loginUser(credentials) */
      set((state) => ({
        ...state,
        decks: [
          ...state.decks,
          {
            ...deckInfo,
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
      decks,
    }))
  },
})
