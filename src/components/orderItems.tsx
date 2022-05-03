import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_PATH } from '../router/paths';
import Tooltip from './tooltip';
import ItemPreview from './itemPreview';
import { sortBy } from 'lodash-es';
import { BiCommentDetail, BiGhost, BiStar } from 'react-icons/bi';
import useWindowSize from '../hooks/useWindowSize';
import classNames from 'classnames';

function OrderItems({ parsedProfile, lang, view, mode, filteredItems }) {
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
              obj[set.en] = {
                type,
                tier,
                en: set.en,
                pl: set.pl
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
          return set && set.en === group.en;
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
        {groupsWithItems.map((itemGroup) => {
          const groupLoot = itemGroup.items.filter((item) =>
            parsedProfile.some(({ data }) => !!data.data[item.key]?.count)
          ).length;

          if (view === 'loot' && !groupLoot) return null;

          return (
            <React.Fragment key={itemGroup.en}>
              <tr className={`sticky${groupLoot === itemGroup.items.length ? ' full' : ''}`}>
                <td colSpan={100}>
                  <a
                    href={`https://diablo.fandom.com/wiki/${itemGroup.en}`}
                    target="__blank"
                    rel="noopener noreferrer"
                  >
                    {lang === 'pl' ? itemGroup.pl : itemGroup.en}
                    {` ${groupLoot}/${itemGroup.items.length}`}
                  </a>
                </td>
              </tr>
              {itemGroup.items.map((item) => {
                const looted = parsedProfile.some(({ data }) => !!data.data[item.key]?.count);

                if (view === 'loot' && !looted) return null;

                const renderLoot = parsedProfile.map(({ user, data }) => (
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
                ));

                return (
                  <tr
                    key={item.key}
                    onClick={() => {
                      navigate(ITEM_PATH(item.key));
                    }}
                  >
                    <td className={classNames(item.type, item.value?.value)}>
                      <button>
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
                      </button>
                    </td>
                    {renderLoot}
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default OrderItems;
