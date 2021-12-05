import React from 'react';
import { useNavigate } from 'react-router-dom';
import items from '../items';
import { ITEM_PATH } from '../router/paths';

function ItemTable({ parsedProfile, search, lang, mode }) {
  const navigate = useNavigate();
  const matchingItems = search
    ? items.filter((item) => item.search.includes(search.toLowerCase()))
    : [];

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{lang === '🇵🇱' ? 'Przedmiot' : 'Item'}</th>
          {parsedProfile.map(({ user, username }) => (
            <React.Fragment key={user}>
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
        {matchingItems.map((item) => (
          <tr
            key={item.key}
            onClick={() => {
              navigate(ITEM_PATH(item.key), { state: { search } });
            }}
          >
            <td className={item.type}>{item[lang === '🇵🇱' ? 'pl' : 'en']}</td>
            {parsedProfile.map(({ user, data }) => (
              <React.Fragment key={user}>
                <td>{data.data[item.key]?.count}</td>
                {mode === '🧑' && <td>{data.data[item.key]?.comment}</td>}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ItemTable;
