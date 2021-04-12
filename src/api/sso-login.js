import axios from '@/utils/axios'

export function askForSso(key, ssoParam) {
  let url
  if (key === 'cms') {
    url = '/account/askForCmsSso'
  }
  return axios.put(`${url}?ssoParam=${ssoParam}`)
}