import axios from 'axios'

import { BASE_URL } from 'config'
import { getServerStatus } from './meta'
import { loginUser, registerUser } from './auth'
import {
  createDeck,
  getDeckInfo,
  myDecks,
  allDecks,
  updateDeck,
  removeDeck,
  addCardToDeck,
  removeCardFromDeck,
} from './deck'

export const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  withCredentials: true,
})

export {
  getServerStatus,
  loginUser,
  registerUser,
  createDeck,
  myDecks,
  allDecks,
  getDeckInfo,
  updateDeck,
  removeDeck,
  addCardToDeck,
  removeCardFromDeck,
}
