import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ItemTable from '../components/itemTable';
import RecentItems from '../components/recentItems';
import { LANG_KEY, MODE_KEY } from '../config/localStorage';
import { useAuth } from '../hooks/auth-hook';
import { useProfile } from '../hooks/resources';
import { HOME_PATH } from '../router/paths';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

function Home() {
  const { user } = useAuth();
  const [{ data: profile }] = useProfile();
  const params = useParams();
  const navigate = useNavigate();
  // const [type, setType] = useState(getLocalStorage(TYPE_KEY) || 'all');
  const [mode, setMode] = useState(getLocalStorage(MODE_KEY) || '👪');
  const [lang, setLang] = useState(getLocalStorage(LANG_KEY) || '🇬🇧');
  const search = params[HOME_PATH()];

  const saveMode = useCallback((mode: string) => {
    setLocalStorage(MODE_KEY, mode);
    setMode(mode);
  }, []);

  const saveLang = useCallback((lang: string) => {
    setLocalStorage(LANG_KEY, lang);
    setLang(lang);
  }, []);

  const parsedProfile =
    profile &&
    (mode === '🧑' ? profile.filter((profileUser) => profileUser.user === user) : profile).map(
      (profile) => {
        const parsedData = JSON.parse(profile.data);

        Object.entries(parsedData.data).forEach(([key, { count }]: [string, { count: string }]) => {
          if (!count) {
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
          type="text"
          id="search"
          placeholder={lang === '🇵🇱' ? 'Szukaj' : 'Search'}
          value={search}
          onChange={onSearch}
        />
        <button onClick={() => saveMode(mode === '👪' ? '🧑' : '👪')}>{mode}</button>
        <button onClick={() => saveLang(lang === '🇬🇧' ? '🇵🇱' : '🇬🇧')}>{lang}</button>
      </header>
      <main>
        {search ? (
          <ItemTable lang={lang} mode={mode} search={search} parsedProfile={parsedProfile} />
        ) : (
          <RecentItems lang={lang} mode={mode} parsedProfile={parsedProfile} />
        )}
      </main>
    </>
  );
}

export default Home;
