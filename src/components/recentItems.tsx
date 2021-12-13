import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { ITEM_PATH } from '../router/paths';
import Tooltip from './tooltip';
import ItemPreview from './itemPreview';

function RecentItems({ parsedProfile, lang, mode, filteredItems }) {
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

  const groupedRecentItems = recentItems.reduce((obj, item) => {
    const dateDistance = formatDistanceToNowStrict(item.date, {
      addSuffix: true,
      locale: lang === 'pl' ? pl : enUS,
    });

    obj[dateDistance] = obj[dateDistance] || [];
    obj[dateDistance].push(item);

    return obj;
  }, {});

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{lang === 'pl' ? 'Przedmiot' : 'Item'}</th>
          {parsedProfile.map(({ username }) => (
            <React.Fragment key={username}>
              <th scope="col">
                {mode === 'solo' ? (
                  lang === 'pl' ? (
                    'Ilość'
                  ) : (
                    'Count'
                  )
                ) : (
                  <>
                    {username.charAt(0).toUpperCase()}
                    <span className="absolute">{username}</span>
                  </>
                )}
              </th>
              {mode === 'solo' && <th>{lang === 'pl' ? 'Komentarz' : 'Comment'}</th>}
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedRecentItems).map(
          ([group, recentItems]: [string, { key: string; date: number; user: string }[]]) => (
            <React.Fragment key={group}>
              <tr className="sticky">
                <td colSpan={100}>{group}</td>
              </tr>
              {recentItems.map(({ key, date, user: itemUser }) => {
                const item = filteredItems.find((item) => item.key === key);
                return (
                  <tr
                    key={date}
                    onClick={() => {
                      navigate(ITEM_PATH(item.key));
                    }}
                  >
                    <td className={item.type}>
                      <Tooltip content={<ItemPreview item={item} lang={lang} />}>
                        {item[lang]}
                      </Tooltip>
                    </td>
                    {parsedProfile.map(({ user, data }) => (
                      <React.Fragment key={user}>
                        <td className={mode === 'group' && user !== itemUser ? 'dimmed' : ''}>
                          {data.data[item.key]?.count}
                        </td>
                        {mode === 'solo' && <td>{data.data[item.key]?.comment}</td>}
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })}
            </React.Fragment>
          )
        )}
      </tbody>
    </table>
  );
}

export default RecentItems;
