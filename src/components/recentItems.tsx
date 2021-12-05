import React from 'react';
import { useNavigate } from 'react-router-dom';
import items from '../items';
import { ITEM_PATH } from '../router/paths';

function RecentItems({ parsedProfile, lang, mode }) {
  const navigate = useNavigate();

  const recentItems = parsedProfile
    .reduce((arr, { user, username, data: { data } }) => {
      Object.entries(data).forEach(([key, { date }]: [string, { date: number }]) => {
        arr.push({
          key,
          date,
          user,
          username,
        });
      });

      return arr;
    }, [])
    .sort((a, b) => b.date - a.date);

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{lang === '🇵🇱' ? 'Przedmiot' : 'Item'}</th>
          {parsedProfile.map(({ username }) => (
            <React.Fragment key={username}>
              <th scope="col">
                {mode === '🧑'
                  ? lang === '🇵🇱'
                    ? 'Ilość'
                    : 'Count'
                  : username.charAt(0).toUpperCase()}
              </th>
              {mode === '🧑' && <th>{lang === '🇵🇱' ? 'Komentarz' : 'Comment'}</th>}
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {recentItems.map(({ key, date, user: itemUser }) => {
          const item = items.find((item) => item.key === key);
          return (
            <tr
              key={date}
              onClick={() => {
                navigate(ITEM_PATH(item.key));
              }}
            >
              <td className={item.type}>{item[lang === '🇵🇱' ? 'pl' : 'en']}</td>
              {parsedProfile.map(({ user, data }) => (
                <React.Fragment key={user}>
                  <td className={mode === '👪' && user !== itemUser ? 'dimmed' : ''}>
                    {data.data[item.key]?.count}
                  </td>
                  {mode === '🧑' && <td>{data.data[item.key]?.comment}</td>}
                </React.Fragment>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RecentItems;
