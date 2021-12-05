export const getLocalStorage = (key: string) => window.localStorage.getItem(key);
export const setLocalStorage = (key: string, value: string | number | object) =>
  window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
