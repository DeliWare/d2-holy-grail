import React, { useState } from 'react';
import items from './items';
import profiles from './loadProfile.mock.json';
import Login from './components/login';

function App() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('pl');
  const [profileVisibility, setProfileVisibility] = useState('all');

  const matchingItems = search
    ? items.filter((item) => item.search.includes(search.toLowerCase()))
    : [];

  const parsedProfiles = (profileVisibility === 'single' ? [profiles[0]] : profiles).map(
    (profile) => ({
      ...profile,
      data: JSON.parse(profile.data).data,
    })
  );

  console.info(matchingItems);
  console.info(parsedProfiles);

  return (
    <>
      <Login/>
      <header>
        <input
          type="text"
          id="search"
          placeholder={lang === 'pl' ? 'Szukaj' : 'Search'}
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <button
          onClick={() => setProfileVisibility(profileVisibility === 'all' ? 'single' : 'all')}
        >
          {profileVisibility}
        </button>
        <button onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}>{lang}</button>
      </header>

      <main>
        {search && (
          <table>
            <thead>
              <tr>
                <th scope="col">{lang === 'pl' ? 'Przedmiot' : 'Item'}</th>
                {parsedProfiles.map((profile) => (
                  <React.Fragment key={profile.user}>
                    <th scope="col">
                      {profileVisibility === 'single'
                        ? lang === 'pl'
                          ? 'Ilość'
                          : 'Count'
                        : profile.username.charAt(0).toUpperCase()}
                    </th>
                    {profileVisibility === 'single' && (
                      <th>{lang === 'pl' ? 'Komentarz' : 'Comment'}</th>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchingItems.map((item) => (
                <tr key={item.key}>
                  <td className={item.type}>{item[lang]}</td>
                  {parsedProfiles.map((profile, i) => (
                    <React.Fragment key={profile.user}>
                      <td>{profile.data[item.key]?.count}</td>
                      {profileVisibility === 'single' && <td>{profile.data[item.key]?.comment}</td>}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default App;
