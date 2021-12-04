import React, { useCallback, useState } from 'react';
import ItemTable from '../components/itemTable';
import { useAuth } from '../hooks/auth-hook';
import profiles from '../loadProfile.mock.json';

const LANG_KEY = 'lang';
const MODE_KEY = 'mode';

function Home() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState(window.localStorage.getItem(MODE_KEY) || '👪');
  const [lang, setLang] = useState(window.localStorage.getItem(LANG_KEY) || '🇵🇱');

  const saveMode = useCallback((mode: string) => {
    window.localStorage.setItem(MODE_KEY, mode);
    setMode(mode);
  }, []);

  const saveLang = useCallback((lang: string) => {
    window.localStorage.setItem(LANG_KEY, lang);
    setLang(lang);
  }, []);

  const parsedProfiles = (
    mode === '👪' ? profiles : profiles.filter((profile) => profile.user === user)
  ).map((profile) => ({
    ...profile,
    data: JSON.parse(profile.data),
  }));

  const onSearch = ({ target: { value } }) => {
    setSearch(value);
  };

  return (
    <>
      <header>
        <input
          type="text"
          id="search"
          placeholder={lang === '🇵🇱' ? 'Szukaj' : 'Search'}
          value={search}
          onChange={onSearch}
        />
        <button onClick={() => saveMode(mode === '👪' ? '🧑' : '👪')}>{mode}</button>
        <button onClick={() => saveLang(lang === '🇵🇱' ? '🇬🇧' : '🇵🇱')}>{lang}</button>
      </header>
      <main>
        {search ? (
          <ItemTable lang={lang} mode={mode} search={search} parsedProfiles={parsedProfiles} />
        ) : (
          <p>Search!</p>
        )}
      </main>
    </>
  );
}

export default Home;
