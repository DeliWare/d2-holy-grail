import React, { useState } from 'react';
import items from '../items';
import profiles from '../loadProfile.mock.json';

function Home() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('🇵🇱');
  const [profileVisibility, setProfileVisibility] = useState('👪');

  const matchingItems = search
    ? items.filter((item) => item.search.includes(search.toLowerCase()))
    : [];

  const parsedProfiles = (profileVisibility === '🧑' ? [profiles[0]] : profiles).map((profile) => ({
    ...profile,
    data: JSON.parse(profile.data).data,
  }));

  console.info(matchingItems);
  console.info(parsedProfiles);

  return (
    <>
      <header>
        <input
          type="text"
          id="search"
          placeholder={lang === '🇵🇱' ? 'Szukaj' : 'Search'}
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <button onClick={() => setProfileVisibility(profileVisibility === '👪' ? '🧑' : '👪')}>
          {profileVisibility}
        </button>
        <button onClick={() => setLang(lang === '🇵🇱' ? '🇬🇧' : '🇵🇱')}>{lang}</button>
      </header>
      <main>
        {search && (
          <table>
            <thead>
              <tr>
                <th scope="col">{lang === '🇵🇱' ? 'Przedmiot' : 'Item'}</th>
                {parsedProfiles.map((profile) => (
                  <React.Fragment key={profile.user}>
                    <th scope="col">
                      {profileVisibility === '🧑'
                        ? lang === '🇵🇱'
                          ? 'Ilość'
                          : 'Count'
                        : profile.username.charAt(0).toUpperCase()}
                    </th>
                    {profileVisibility === '🧑' && (
                      <th>{lang === '🇵🇱' ? 'Komentarz' : 'Comment'}</th>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchingItems.map((item) => (
                <tr key={item.key}>
                  <td className={item.type}>{item[lang === '🇵🇱' ? 'pl' : 'en']}</td>
                  {parsedProfiles.map((profile, i) => (
                    <React.Fragment key={profile.user}>
                      <td>{profile.data[item.key]?.count}</td>
                      {profileVisibility === '🧑' && <td>{profile.data[item.key]?.comment}</td>}
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

export default Home;
