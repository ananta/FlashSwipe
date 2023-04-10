import axios from 'axios'

import { BASE_URL } from 'config'

export const getServerStatus = async () => {
  const response = await axios<{
    message: string
    status: string
  }>({
    method: 'get',
    url: `${BASE_URL}/api/status`,
  })
  return response.data
}
