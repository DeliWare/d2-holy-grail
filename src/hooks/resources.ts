import useAxios from 'axios-hooks'
import { MaxrollHost } from '../utils/remote-url';

export interface LoginResponseData {
  token?: string
  errors?: string[]
}

export interface LoginRequestData {
  action: string
  user_name: string
  password_hash: string
}

export function useLogin() {
  // TODO FormData interface with LoginRequestData??
  return useAxios<LoginResponseData, FormData>(
    { url: MaxrollHost('account'), method: 'POST'},
    { manual: true },
  )
}