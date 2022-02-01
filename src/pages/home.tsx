import React, { useRef, useState } from 'react';
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
import { debounce } from 'lodash-es';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) => type === 'all' || item.type === type || item.value?.value === type
  );

  const onChange = debounce(() => {
    navigate(`/${encodeURIComponent(inputRef.current.value)}`, { replace: true });
  }, 400);

  const onKeyDown = ({ key }) => {
    if (key === 'Delete') {
      inputRef.current.value = '';
      onChange();
    }
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

          console.info(item, count);

          if (!item || !Number(count)) {
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
          ref={inputRef}
          className="grow"
          type="text"
          id="search"
          autoComplete="off"
          placeholder={lang === 'pl' ? 'Szukaj' : 'Search'}
          defaultValue={search}
          onChange={onChange}
          onKeyDown={onKeyDown}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!isMobile}
        />
        <button
          onClick={() => saveView(view === 'recent' ? 'order' : 'recent')}
          title={lang === 'pl' ? 'Domyślny widok' : 'Default view'}
          tabIndex={-1}
        >
          {view === 'recent'
            ? lang === 'pl'
              ? 'ostatnie'
              : 'recent'
            : lang === 'pl'
            ? 'nowy ład'
            : 'order'}
        </button>
        <select className="right" value={type} onChange={saveType} tabIndex={-1}>
          <option value="all">{lang === 'pl' ? 'wszystko' : 'everything'}</option>
          <option value="rune">{lang === 'pl' ? 'runy' : 'runes'}</option>
          <option value="unique-weapon">{lang === 'pl' ? 'bronie' : 'weapons'}</option>
          <option value="unique-armor">{lang === 'pl' ? 'pancerz' : 'armors'}</option>
          <option value="unique-other">{lang === 'pl' ? 'inne' : 'others'}</option>
          <option value="set">{lang === 'pl' ? 'zestawy' : 'sets'}</option>
          <option value="High">{lang === 'pl' ? 'wysoka' : 'high'}</option>
          <option value="Med">{lang === 'pl' ? 'średnia' : 'medium'}</option>
          <option value="Low">{lang === 'pl' ? 'niska' : 'low'}</option>
          <option value="None">{lang === 'pl' ? 'żadna' : 'none'}</option>
          <option value="TRASH">{lang === 'pl' ? 'śmieć' : 'trash'}</option>
        </select>
        <button onClick={() => saveMode(mode === 'group' ? 'solo' : 'group')} tabIndex={-1}>
          {mode === 'group' ? (lang === 'pl' ? 'grupa' : 'group') : lang === 'pl' ? 'solo' : 'solo'}
        </button>
        <button onClick={() => saveLang(lang === 'pl' ? 'en' : 'pl')} tabIndex={-1}>
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
