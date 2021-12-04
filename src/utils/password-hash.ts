import MD5 from 'crypto-js/md5';

export function hashPassword(password: string): string {
  const SALT = 'SmartSalt';
  return MD5(`${SALT}${password}`);
}

