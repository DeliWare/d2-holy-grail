import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './requireAuth';
import Home from '../components/home';
import Login from '../components/login';
import { HOME_PATH, LOGIN_PATH } from './paths';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN_PATH()} element={<Login />} />
        <Route
          path={HOME_PATH()}
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
