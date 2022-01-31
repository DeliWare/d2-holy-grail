import React, { useEffect, useState } from 'react';
import { useLogin } from '../hooks/resources';
import useAuth from '../hooks/useAuth';
import { hashPassword } from '../utils/password-hash';
import { useLocation, useNavigate } from 'react-router';
import { HOME_PATH } from '../router/paths';

function Login() {
  const [{ data, loading }, execute] = useLogin();
  const { saveToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (data?.token) {
      // @ts-expect-error location.state.from exists!
      const { from } = location.state || { from: { pathname: HOME_PATH() } };

      saveToken(data.token);
      navigate(from, { replace: true });
    }

    if (data?.errors) {
      alert(data?.errors.join('\n'));
    }
  }, [data, saveToken, location, navigate]);

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
    <main>
      <section>
        <img src="./images/d2r_logo.gif" alt="" width="250" height="170" className="logo" />
        <h1>Better D2R Holy Grail</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              placeholder="Username"
              name="username"
              type="text"
              required
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              placeholder="Password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <footer>
            <button disabled={loading} type="submit">
              Login
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}

export default Login;
