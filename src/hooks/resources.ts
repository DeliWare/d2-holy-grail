import useAxios from 'axios-hooks';
import { MaxrollHost } from '../utils/remote-url';
import { PROFILE_KEY, TOKEN_KEY } from '../config/localStorage';
import { getLocalStorage } from '../utils/localStorage';

export interface LoginResponseData {
  token?: string;
  errors?: string[];
}
export interface UserResponseData {
  id?: string;
  data?: string;
}

export interface ProfileResponseData {
  user?: number;
  username?: string;
  owner?: number;
  data?: string;
}

export function useLogin(options = { manual: true }) {
  return useAxios<LoginResponseData, FormData>(
    { url: MaxrollHost('account'), method: 'POST' },
    options
  );
}

export function useUser(options = { manual: false }) {
  return useAxios<UserResponseData[]>(
    {
      url: MaxrollHost('grail?action=loadUser'),
      method: 'POST',
      headers: { Authorization: `Bearer ${getLocalStorage(TOKEN_KEY)}` },
    },
    options
  );
}

export function useProfile(options = { manual: false }) {
  return useAxios<ProfileResponseData[]>(
    {
      url: MaxrollHost(`grail?action=loadProfile&id=${getLocalStorage(PROFILE_KEY)}`),
      method: 'POST',
      headers: { Authorization: `Bearer ${getLocalStorage(TOKEN_KEY)}` },
    },
    options
  );
}

export function useSaveProfile(options = { manual: true }) {
  return useAxios<ProfileResponseData[]>(
    {
      url: MaxrollHost(`grail?action=saveProfile&id=${getLocalStorage(PROFILE_KEY)}`),
      method: 'POST',
      headers: { Authorization: `Bearer ${getLocalStorage(TOKEN_KEY)}` },
    },
    options
  );
}
