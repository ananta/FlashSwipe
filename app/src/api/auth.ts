import axios from 'axios'

import { BASE_URL } from 'config'
import { IUserCredentials, IUserInfo, IUserProfile } from 'store/authSlice'

export const loginUser = async ({ username, password }: IUserCredentials) => {
  const configurationObject = {
    method: 'post',
    url: `${BASE_URL}/login`,
    data: {
      username,
      password,
    },
  }
  const response = await axios<IUserInfo>(configurationObject)
  return response.data
}

export const registerUser = async ({
  first_name,
  last_name,
  username,
  password,
}: IUserCredentials & IUserProfile) => {
  const configurationObject = {
    method: 'post',
    url: `${BASE_URL}/register`,
    data: {
      first_name,
      last_name,
      username,
      password,
    },
  }
  const response = await axios(configurationObject)
  return response.data
}
