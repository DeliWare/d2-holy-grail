import { useCallback } from 'react';
import jwt_decode from 'jwt-decode';

interface JWT {
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  userId: number;
  userLevel: number;
  userName: 'string';
}

export const TOKEN_KEY = 'token-maxroll';
export const USER_KEY = 'user-maxroll';

export function useAuth() {
  const saveToken = useCallback((token: string) => {
    const decoded: JWT = jwt_decode(token);

    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, `${decoded.userId}`);
  }, []);

  const isLoggedIn = window.localStorage.getItem(TOKEN_KEY) !== null;
  const user = Number(window.localStorage.getItem(USER_KEY));

  return {
    saveToken,
    isLoggedIn,
    user,
  };
}
