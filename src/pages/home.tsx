import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ItemTable from '../components/itemTable';
import RecentItems from '../components/recentItems';
import { LANG_KEY, MODE_KEY, TYPE_KEY } from '../config/localStorage';
import { useAuth } from '../hooks/auth-hook';
import { useProfile } from '../hooks/resources';
import { getLang, getMode, getType, setLocalStorage } from '../utils/localStorage';
import items from '../items';
import { DEFAULT_PATH } from '../router/paths';

function Home() {
  const { user } = useAuth();
  const [{ data: profile }] = useProfile();
  const params = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState(getType());
  const [mode, setMode] = useState(getMode());
  const [lang, setLang] = useState(getLang());
  const search = params[DEFAULT_PATH()];

  const filteredItems = items.filter((item) => type === 'all' || item.type === type);

  const onSearch = ({ target: { value } }) => {
    navigate(`/${encodeURIComponent(value)}`, { replace: true });
  };

  const saveType = ({ target: { value } }) => {
    setLocalStorage(TYPE_KEY, value);
    setType(value);
  };

  const saveMode = ({ target: { value } }) => {
    setLocalStorage(MODE_KEY, value);
    setMode(value);
  };

  const saveLang = ({ target: { value } }) => {
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
          placeholder={lang === 'pl' ? 'szukaj' : 'search'}
          value={search}
          onChange={onSearch}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <select className="right" value={type} onChange={saveType}>
          <option value="all">{lang === 'pl' ? 'wszystko' : 'everything'}</option>
          <option value="rune">{lang === 'pl' ? 'runy' : 'runes'}</option>
          <option value="unique">{lang === 'pl' ? 'unikaty' : 'uniques'}</option>
          <option value="set">{lang === 'pl' ? 'zestawy' : 'sets'}</option>
        </select>
        <select className="left" value={mode} onChange={saveMode}>
          <option value="group">{lang === 'pl' ? 'grupa' : 'group'}</option>
          <option value="solo">{lang === 'pl' ? 'solo' : 'solo'}</option>
        </select>
        <select className="right" value={lang} onChange={saveLang}>
          <option value="pl">pl</option>
          <option value="en">en</option>
        </select>
      </header>
      <main>
        {search ? (
          <ItemTable
            lang={lang}
            mode={mode}
            search={search}
            parsedProfile={parsedProfile}
            filteredItems={filteredItems}
          />
        ) : (
          <RecentItems
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
