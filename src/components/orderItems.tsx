import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_PATH } from '../router/paths';
import Tooltip from './tooltip';
import ItemPreview from './itemPreview';
import { sortBy } from 'lodash-es';
import { BiCommentDetail, BiGhost, BiStar } from 'react-icons/bi';
import useWindowSize from '../hooks/useWindowSize';
import classNames from 'classnames';

function OrderItems({ parsedProfile, lang, mode, filteredItems }) {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const groups = useMemo(() => {
    const sortOrderGroups = ['rune', 'set', 'unique-weapon', 'unique-armor', 'unique-other'];

    return sortBy(
      sortBy(
        filteredItems.reduce((obj, { type, attr: { typeClass, tierName, set, tier } }) => {
          switch (type) {
            case 'rune':
              obj['Runes'] = {
                type,
                tier: 1,
                en: 'Runes',
                pl: 'Runy'
              };
              break;
            case 'set':
              obj[set] = {
                type,
                tier,
                en: set,
                pl: set
              };
              break;
            default:
              obj[`${tierName} ${typeClass.en}`] = {
                type,
                tier,
                en: `${tierName} ${typeClass.en}`,
                pl: `${tierName} ${typeClass.pl}`
              };
          }

          return obj;
        }, {}),
        (item) => item.tier
      ),
      ({ type }) => sortOrderGroups.indexOf(type)
    );
  }, [filteredItems]);

  const groupsWithItems = useMemo(() => {
    return groups.map((group) => {
      group.items = filteredItems.filter(({ type, attr: { typeClass, tierName, set, isSet } }) => {
        if (group.type === 'rune') {
          return type === 'rune';
        }

        if (group.type === 'set') {
          return set === group.en;
        }

        return group.en === `${tierName} ${typeClass?.en}` && !isSet;
      });

      return group;
    });
  }, [filteredItems, groups]);

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
        {groupsWithItems.map((itemGroup) => (
          <React.Fragment key={itemGroup.en}>
            <tr className="sticky">
              <td colSpan={100}>{lang === 'pl' ? itemGroup.pl : itemGroup.en}</td>
            </tr>
            {itemGroup.items.map((item) => {
              return (
                <tr
                  key={item.key}
                  onClick={() => {
                    navigate(ITEM_PATH(item.key));
                  }}
                >
                  <td className={classNames(item.type, item.value?.value)}>
                    {isMobile ? (
                      item[lang]
                    ) : (
                      <Tooltip
                        content={<ItemPreview item={item} lang={lang} />}
                        disableClass={true}
                      >
                        {item[lang]}
                      </Tooltip>
                    )}
                  </td>
                  {parsedProfile.map(({ user, data }) => (
                    <React.Fragment key={user}>
                      <td className="no-wrap">
                        {data.data[item.key]?.count}
                        {mode === 'group' && data.data[item.key]?.comment && !isMobile && (
                          <Tooltip content={data.data[item.key]?.comment}>
                            <BiCommentDetail />
                          </Tooltip>
                        )}
                        {data.data[item.key]?.perfect && (
                          <BiStar title={lang === 'pl' ? 'Idealny' : 'Perfect'} />
                        )}
                        {data.data[item.key]?.ethereal && (
                          <BiGhost title={lang === 'pl' ? 'Eteryczny' : 'Ethereal'} />
                        )}
                      </td>
                      {mode === 'solo' && <td>{data.data[item.key]?.comment}</td>}
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default OrderItems;
