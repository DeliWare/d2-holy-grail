import { useCallback } from 'react';

export const TOKEN_KEY = 'token-maxroll';

export function useAuth() {
  const saveToken = useCallback((token: string) => {
    window.localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const isLoggedIn = window.localStorage.getItem(TOKEN_KEY) !== null;

  return {
    saveToken,
    isLoggedIn
  };
}