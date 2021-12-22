import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProfile, useSaveProfile } from '../hooks/resources';
import items from '../items';
import { HOME_PATH } from '../router/paths';
import { getLang, getUser } from '../utils/localStorage';
import ItemPreview from '../components/itemPreview';
import useWindowSize from '../hooks/useWindowSize';

function Item() {
  const params = useParams();
  const [{ data: profile, loading }, executeProfile] = useProfile();
  const [{ loading: saving }, executeSave] = useSaveProfile();
  const lang = getLang();
  const item = items.find((item) => item.key === params.itemKey);
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const currentUserProfile = profile.find((profile) => profile.user === getUser());
  const parsedUserData = JSON.parse(currentUserProfile.data);
  const userItem = parsedUserData.data[params.itemKey];
  const existingComments = Array.from(
    new Set(
      Object.values(parsedUserData.data)
        .map((item: { comment: string }) => item.comment)
        .filter(Boolean)
        .sort()
    )
  );

  const [itemState, setItemState] = useState(userItem || { count: 0 });

  const canBeEthereal = !['rune', 'set'].includes(item.type);
  const canBePerfect = item.type !== 'rune';

  const onChange = ({ target: { name, value } }) => {
    setItemState({ ...itemState, [name]: value });
  };

  const onDecrementCount = () => {
    setItemState({ ...itemState, count: Math.max(0, itemState.count - 1) });
  };
  const onIncrementCount = () => {
    setItemState({ ...itemState, count: itemState.count + 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itemState.count === 0) {
      delete parsedUserData.data[params.itemKey];
    } else {
      parsedUserData.data[params.itemKey] = itemState;

      if (!userItem || userItem.count < itemState.count) {
        parsedUserData.data[params.itemKey].date = Date.now();
      }
    }

    executeSave({ data: JSON.stringify(parsedUserData) })
      .then(() => executeProfile())
      .then(() => navigate(HOME_PATH()));
  };

  const parseLinkItemName = (name) => {
    // used for d2rr.com and rankedboost.com
    return name.toLowerCase()
      .replaceAll("'", '')
      .replaceAll(' ', '-');
  }

  const parseLinkItemNameForItemForge = (name) => {
    const regex = /'./ig;
    return name.toLowerCase()
      .replaceAll(regex, '')
      .replaceAll(' ', '-');
  }

  return (
    <main>
      <section>
        <h1 className={item.type}>
          <a href={`https://diablo.fandom.com/wiki/${item.en}`}
             target="__blank"
             rel="noopener noreferrer">
            {item[lang]}
          </a>
        </h1>

        <form onSubmit={handleSubmit}>
          <label>
            <span>{lang === 'pl' ? 'Ilość:' : 'Count:'}</span>
            <input
              name="count"
              type="number"
              value={Number(itemState.count).toString()}
              min={0}
              onChange={onChange}
              autoComplete="off"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={!isMobile}
            />
            <button type="button" onClick={onDecrementCount}>
              ➖
            </button>
            <button type="button" onClick={onIncrementCount}>
              ➕
            </button>
          </label>

          <label>
            <span>{lang === 'pl' ? 'Wybierz Komentarz:' : 'Select Comment:'}</span>
            <select
              id="comment"
              value={itemState.comment}
              name="comment"
              onChange={onChange}
            >
              <option value=""></option>
              {existingComments.map((comment) => (
                <option key={comment} value={comment}>
                  {comment}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{lang === 'pl' ? 'Komentarz:' : 'Comment'}</span>
            <textarea name="comment" value={itemState.comment} onChange={onChange} />
          </label>

          {canBeEthereal && (
            <label>
              <span>{lang === 'pl' ? 'Eteryczny:' : 'Ethereal:'}</span>
              <input
                name="ethereal"
                type="checkbox"
                defaultChecked={itemState.ethereal}
                onChange={() => setItemState({ ...itemState, ethereal: !itemState.ethereal })}
              />
            </label>
          )}

          {canBePerfect && (
            <label>
              <span>{lang === 'pl' ? 'Idealny:' : 'Perfect:'}</span>
              <input
                name="perfect"
                type="checkbox"
                defaultChecked={itemState.perfect}
                onChange={() => setItemState({ ...itemState, perfect: !itemState.perfect })}
              />
            </label>
          )}

          <footer>
            <button className="button-cta" type="submit" disabled={loading || saving}>
              {lang === 'pl' ? 'Zapisz' : 'Save'}
            </button>
            <button className="button-cta" type="button" onClick={() => navigate(HOME_PATH())}>
              {lang === 'pl' ? 'Anuluj' : 'Cancel'}
            </button>
          </footer>
        </form>
      </section>
      <section>
        <ItemPreview item={item} lang={lang} />
      </section>
      <section>
        <h2>{lang === 'pl' ? 'Zasoby' : 'Resources'}</h2>
        <a href={`https://diablo.fandom.com/wiki/${item.en}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          Wiki: diablo.fandom.com
        </a>
        <a href={`https://d2rr.com/product/${parseLinkItemName(item.en)}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          Prices: d2rr.com
        </a>
        <a href={`https://itemforge.com/en/${parseLinkItemNameForItemForge(item.en)}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          Prices: itemforge.com
        </a>
        <a href={`https://d2.maxroll.gg/d2-drop-calculator#mf100;item=${item.type},${item.key}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          Drop calculator: maxroll.gg
        </a>
        <a href={`https://rankedboost.com/diablo-2/items/${parseLinkItemName(item.en)}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          Drop locations: rankedboost.com
        </a>
        <a href={`https://diablo2.wiki.fextralife.com/${item.en}`}
           className="link"
           target={'_blank'}
           rel="noopener noreferrer">
          fextralife.com
        </a>
      </section>
    </main>
  );
}

export default Item;
