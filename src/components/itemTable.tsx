import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_PATH } from '../router/paths';
import normalized from '../utils/normalized';
import ItemPreview from './itemPreview';
import { BiCommentDetail, BiGhost, BiStar } from 'react-icons/bi';
import Tooltip from './tooltip';
import useWindowSize from '../hooks/useWindowSize';

function ItemTable({ parsedProfile, search, lang, mode, filteredItems }) {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const matchingItems = search
    ? filteredItems.filter((item) => normalized(item.search).includes(normalized(search)))
    : [];

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{lang === 'pl' ? 'Przedmiot' : 'Item'}</th>
          {parsedProfile.map(({ user, username }) => (
            <React.Fragment key={user}>
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
        {matchingItems.length ? (
          matchingItems.map((item) => (
            <tr
              key={item.key}
              onClick={() => {
                navigate(ITEM_PATH(item.key), { state: { search } });
              }}
            >
              <td className={item.type}>
                {isMobile ? item[lang] : <Tooltip content={<ItemPreview item={item} lang={lang} />} disableClass={true}>
                  {item[lang]}
                </Tooltip>}
              </td>
              {parsedProfile.map(({ user, data: { data } }) => (
                <React.Fragment key={user}>
                  <td>
                    {data[item.key]?.count}
                    {mode === 'group' && data[item.key]?.comment && !isMobile && <Tooltip content={data[item.key]?.comment}>
                      <BiCommentDetail />
                    </Tooltip>}
                    {data[item.key]?.perfect && <BiStar title={lang === 'pl' ? 'Idealny' : 'Perfect'}/>}
                    {data[item.key]?.ethereal && <BiGhost title={lang === 'pl' ? 'Eteryczny' : 'Ethereal'}/>}
                  </td>
                  {mode === 'solo' && <td>{data[item.key]?.comment}</td>}
                </React.Fragment>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={100} className="dimmed">
              {lang === 'pl' ? 'Nic nie znaleziono' : 'Nothing found'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ItemTable;
