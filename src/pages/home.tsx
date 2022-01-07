import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ItemTable from '../components/itemTable';
import RecentItems from '../components/recentItems';
import { VIEW_KEY, LANG_KEY, MODE_KEY, TYPE_KEY } from '../config/localStorage';
import useAuth from '../hooks/useAuth';
import { useProfile } from '../hooks/resources';
import { getView, getLang, getMode, getType, setLocalStorage } from '../utils/localStorage';
import items from '../items';
import { DEFAULT_PATH } from '../router/paths';
import useWindowSize from '../hooks/useWindowSize';
import OrderItems from '../components/orderItems';

function Home() {
  const { user } = useAuth();
  const [{ data: profile }] = useProfile();
  const params = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState(getType());
  const [mode, setMode] = useState(getMode());
  const [view, setView] = useState(getView());
  const [lang, setLang] = useState(getLang());
  const search = params[DEFAULT_PATH()];
  const { isMobile } = useWindowSize();

  const filteredItems = items.filter((item) => type === 'all' || item.type === type);

  const onSearch = ({ target: { value } }) => {
    navigate(`/${encodeURIComponent(value)}`, { replace: true });
  };

  const saveType = ({ target: { value } }) => {
    setLocalStorage(TYPE_KEY, value);
    setType(value);
  };

  const saveMode = (value) => {
    setLocalStorage(MODE_KEY, value);
    setMode(value);
  };

  const saveView = (value) => {
    setLocalStorage(VIEW_KEY, value);
    setView(value);
  };

  const saveLang = (value) => {
    setLocalStorage(LANG_KEY, value);
    setLang(value);
  };

  const parsedProfile =
    profile &&
    (mode === 'solo' ? profile.filter((profileUser) => profileUser.user === user) : profile).map(
      (profile) => {
        const parsedData = JSON.parse(profile.data);

        Object.entries(parsedData.data).forEach(([key, { count }]: [string, { count: string }]) => {
          const item = filteredItems.find((item) => item.key === key);

          if (!item || !count) {
            delete parsedData.data[key];
          }
        });

        return {
          ...profile,
          data: parsedData
        };
      }
    );

  return (
    <>
      <header>
        <input
          className="grow"
          type="text"
          id="search"
          autoComplete="off"
          placeholder={lang === 'pl' ? 'Szukaj' : 'Search'}
          value={search}
          onChange={onSearch}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!isMobile}
        />
        <button
          onClick={() => saveView(view === 'recent' ? 'order' : 'recent')}
          title={lang === 'pl' ? 'Domyślny widok' : 'Default view'}
        >
          {view === 'recent'
            ? lang === 'pl'
              ? 'ostatnie'
              : 'recent'
            : lang === 'pl'
            ? 'nowy ład'
            : 'order'}
        </button>
        <select className="right" value={type} onChange={saveType}>
          <option value="all">{lang === 'pl' ? 'wszystko' : 'everything'}</option>
          <option value="rune">{lang === 'pl' ? 'runy' : 'runes'}</option>
          <option value="unique-weapon">{lang === 'pl' ? 'bronie' : 'weapons'}</option>
          <option value="unique-armor">{lang === 'pl' ? 'pancerz' : 'armors'}</option>
          <option value="unique-other">{lang === 'pl' ? 'inne' : 'others'}</option>
          <option value="set">{lang === 'pl' ? 'zestawy' : 'sets'}</option>
        </select>
        <button onClick={() => saveMode(mode === 'group' ? 'solo' : 'group')}>
          {mode === 'group' ? (lang === 'pl' ? 'grupa' : 'group') : lang === 'pl' ? 'solo' : 'solo'}
        </button>
        <button onClick={() => saveLang(lang === 'pl' ? 'en' : 'pl')}>
          {lang === 'pl' ? 'pl' : 'en'}
        </button>
      </header>
      <main>
        {search ? (
          <ItemTable
            lang={lang}
            mode={mode}
            search={search}
            type={type}
            parsedProfile={parsedProfile}
            filteredItems={filteredItems}
          />
        ) : view === 'recent' ? (
          <RecentItems
            lang={lang}
            mode={mode}
            parsedProfile={parsedProfile}
            filteredItems={filteredItems}
          />
        ) : (
          <OrderItems
            lang={lang}
            mode={mode}
            parsedProfile={parsedProfile}
            filteredItems={filteredItems}
          />
        )}
      </main>
    </>
  );
}

export default Home;
