import React, { useEffect, useState } from 'react';
import { useLogin } from '../hooks/resources';
import { useAuth } from '../hooks/auth-hook';
import { hashPassword } from '../utils/password-hash';

function Login() {
  const [{ data, loading }, execute] = useLogin();
  const { saveToken } = useAuth();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (data?.token) {
      saveToken(data.token);
      alert(`Success! Token: ${data.token}`);
      // TODO redirect
    }

    if (data?.errors) {
      alert(data?.errors.join('\n'));
    }
  }, [data, saveToken]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('action', 'signin');
    data.append('user_name', userName);
    data.append('password_hash', hashPassword(password));

    execute({
      data
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name={'username'}
          type={'text'}
          required
          value={userName}
          onChange={event => setUserName(event.target.value)}
        />
        <input
          name={'password'}
          type={'password'}
          required
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <button
          disabled={loading}
          type={'submit'}
        >Login
        </button>
      </form>
    </>
  );
}

export default Login;
