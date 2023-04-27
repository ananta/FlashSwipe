import axios from 'axios'

import { BASE_URL } from 'config'
import { getServerStatus } from './meta'
import { loginUser, registerUser } from './auth'

export const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  withCredentials: true,
})

export { getServerStatus, loginUser, registerUser }
