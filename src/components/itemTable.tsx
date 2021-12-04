import React from 'react';
import { Link } from 'react-router-dom';
import items from '../items';
import { ITEM_PATH } from '../router/paths';

function ItemTable({ parsedProfiles, search, lang, mode }) {
  const matchingItems = search
    ? items.filter((item) => item.search.includes(search.toLowerCase()))
    : [];

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{lang === '🇵🇱' ? 'Przedmiot' : 'Item'}</th>
          {parsedProfiles.map((profile) => (
            <React.Fragment key={profile.user}>
              <th scope="col">
                {mode === '🧑'
                  ? lang === '🇵🇱'
                    ? 'Ilość'
                    : 'Count'
                  : profile.username.charAt(0).toUpperCase()}
              </th>
              {mode === '🧑' && <th>{lang === '🇵🇱' ? 'Komentarz' : 'Comment'}</th>}
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {matchingItems.map((item) => (
          <tr key={item.key}>
            <td className={item.type}>
              <Link to={ITEM_PATH(item.key)} state={{ search }}>
                {item[lang === '🇵🇱' ? 'pl' : 'en']}
              </Link>
            </td>
            {parsedProfiles.map((profile, i) => (
              <React.Fragment key={profile.user}>
                <td>{profile.data.data[item.key]?.count}</td>
                {mode === '🧑' && <td>{profile.data.data[item.key]?.comment}</td>}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ItemTable;
