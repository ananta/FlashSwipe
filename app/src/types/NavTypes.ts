import { IDeckWithCards } from 'store/deckSlice'

export type RootAuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type RootStackParamList = {
  Home: undefined
  'Add Deck': undefined
  'Deck Info': { deck_id: number }
  'Your Decks': undefined
  'Swipe Screen': { deck: IDeckWithCards }
  Profile: { user_id: string }
}
