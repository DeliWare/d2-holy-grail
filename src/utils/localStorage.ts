import {
  VIEW_KEY,
  LANG_KEY,
  MODE_KEY,
  PROFILE_KEY,
  TYPE_KEY,
  USER_KEY
} from '../config/localStorage';

export const getLocalStorage = (key: string) => window.localStorage.getItem(key);
export const setLocalStorage = (key: string, value: string | number | object) =>
  window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
export const removeLocalStorage = (key: string) => window.localStorage.removeItem(key);
export const getUser = () => Number(getLocalStorage(USER_KEY));
export const getProfile = () => getLocalStorage(PROFILE_KEY) || '';
export const getType = () => getLocalStorage(TYPE_KEY) || 'all';
export const getMode = () => getLocalStorage(MODE_KEY) || 'group';
export const getView = () => getLocalStorage(VIEW_KEY) || 'recent';
export const getLang = () => getLocalStorage(LANG_KEY) || 'pl';
