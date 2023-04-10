import axios, { AxiosRequestConfig } from 'axios'

import { BASE_URL } from 'config'
import { ICardInfo, IDeck, IDeckInfo, IDeckWithCards } from 'store/deckSlice'

export const getDeckInfo = async ({ deckId }: { deckId: number }) => {
  const response = await axios<IDeckWithCards>({
    method: 'get',
    url: `${BASE_URL}/decks/${deckId}`,
  })
  return response.data
}

export const createDeck = async (
  { title, description }: IDeckInfo,
  config: AxiosRequestConfig
): Promise<IDeck> => {
  console.log({
    title,
    description,
  })
  const response = await axios<IDeck>({
    ...config,
    method: 'post',
    url: `${BASE_URL}/decks`,
    data: {
      title,
      description,
    },
  })
  return response.data
}

export const updateDeck = async ({
  title,
  description,
  deck_id,
}: IDeckInfo & { deck_id: number }) => {
  const response = await axios<IDeckInfo>({
    method: 'patch',
    url: `${BASE_URL}/decks/${deck_id}`,
    data: {
      title,
      description,
    },
  })
  return response.data
}

export const myDecks = async (config: AxiosRequestConfig) => {
  const response = await axios<IDeck[]>({
    ...config,
    method: 'get',
    url: `${BASE_URL}/decks/user`,
  })
  return response.data
}

export const allDecks = async (config: AxiosRequestConfig) => {
  const response = await axios<IDeck[]>({
    ...config,
    method: 'get',
    url: `${BASE_URL}/decks`,
  })
  return response.data
}

export const addCardToDeck = async ({
  front,
  back,
  deck_id,
}: ICardInfo & { deck_id: number }) => {
  const response = await axios<IDeckInfo>({
    method: 'post',
    url: `${BASE_URL}/decks/${deck_id}/cards`,
    data: {
      front,
      back,
    },
  })
  return response.data
}

export const removeDeck = async ({ deck_id }: { deck_id: number }) => {
  const response = await axios<void>({
    method: 'delete',
    url: `${BASE_URL}/decks/${deck_id}`,
  })
  return response.data
}

export const removeCardFromDeck = async ({
  deck_id,
  card_id,
}: {
  deck_id: number
  card_id: number
}) => {
  const response = await axios<void>({
    method: 'delete',
    url: `${BASE_URL}/decks/${deck_id}/cards/${card_id}`,
  })
  return response.data
}
