import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ItemTable from '../components/itemTable';
import RecentItems from '../components/recentItems';
import { LANG_KEY, MODE_KEY, TYPE_KEY } from '../config/localStorage';
import { useAuth } from '../hooks/auth-hook';
import { useProfile } from '../hooks/resources';
import { HOME_PATH } from '../router/paths';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import items from '../items';

function Home() {
  const { user } = useAuth();
  const [{ data: profile }] = useProfile();
  const params = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState(getLocalStorage(TYPE_KEY) || 'all');
  const [mode, setMode] = useState(getLocalStorage(MODE_KEY) || 'group');
  const [lang, setLang] = useState(getLocalStorage(LANG_KEY) || 'pl');
  const search = params[HOME_PATH()];

  const filteredItems = items.filter((item) => type === 'all' || item.type === type);

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
          data: parsedData,
        };
      }
    );

  const onSearch = ({ target: { value } }) => {
    navigate(`/${value}`, { replace: true });
  };

  return (
    <>
      <header>
        <input
          className="grow"
          type="text"
          id="search"
          placeholder={lang === 'pl' ? 'szukaj' : 'search'}
          value={search}
          onChange={onSearch}
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
