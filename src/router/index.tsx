import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './requireAuth';
import Home from '../pages/home';
import Login from '../pages/login';
import Item from '../pages/item';
import { HOME_PATH, ITEM_PATH, LOGIN_PATH } from './paths';

function App() {
  return (
    <BrowserRouter basename="/d2-holy-grail">
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
        <Route
          path={ITEM_PATH()}
          element={
            <RequireAuth>
              <Item />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
