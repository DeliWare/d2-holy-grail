import { useCallback } from 'react';
import jwt_decode from 'jwt-decode';
import { TOKEN_KEY, USER_KEY } from '../config/localStorage';
import { getLocalStorage, getUser, setLocalStorage } from '../utils/localStorage';

interface JWT {
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  userId: number;
  userLevel: number;
  userName: 'string';
}

export function useAuth() {
  const saveToken = useCallback((token: string) => {
    const decoded: JWT = jwt_decode(token);

    setLocalStorage(TOKEN_KEY, token);
    setLocalStorage(USER_KEY, `${decoded.userId}`);
  }, []);

  const isLoggedIn = getLocalStorage(TOKEN_KEY) !== null;
  const user = getUser();

  return {
    saveToken,
    isLoggedIn,
    user,
  };
}
