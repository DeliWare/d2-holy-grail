import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import RequireUser from './requireUser';
import Home from '../pages/home';
import Login from '../pages/login';
import Item from '../pages/item';
import RequireAuth from './requireAuth';
import RequireProfile from './requireProfile';
import ScrollToTop from './scrollToTop';
import { DEFAULT_PATH, ITEM_PATH, LOGIN_PATH } from './paths';

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path={LOGIN_PATH()} element={<Login />} />
        <Route
          path={ITEM_PATH()}
          element={
            <RequireAuth>
              <RequireUser>
                <RequireProfile>
                  <Item />
                </RequireProfile>
              </RequireUser>
            </RequireAuth>
          }
        />
        <Route
          path={DEFAULT_PATH()}
          element={
            <RequireAuth>
              <RequireUser>
                <RequireProfile>
                  <Home />
                </RequireProfile>
              </RequireUser>
            </RequireAuth>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
