import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProfile, useSaveProfile } from '../hooks/resources';
import items from '../items';
import { HOME_PATH } from '../router/paths';
import { getLang, getUser } from '../utils/localStorage';

function Item() {
  const params = useParams();
  const [{ data: profile, loading }, executeProfile] = useProfile();
  const [{ loading: saving }, executeSave] = useSaveProfile();
  const lang = getLang();
  const item = items.find((item) => item.key === params.itemKey);
  const navigate = useNavigate();

  const currentUserProfile = profile.find((profile) => profile.user === getUser());
  const parsedUserData = JSON.parse(currentUserProfile.data);
  const userItem = parsedUserData.data[params.itemKey];
  const existingComments = Array.from(
    new Set(
      Object.values(parsedUserData.data)
        .map((item: { comment: string }) => item.comment)
        .filter(Boolean)
    )
  );

  const [itemState, setItemState] = useState(userItem || { count: 0 });
  const [newComment, setNewComment] = useState(false);

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

  return (
    <main>
      <section>
        <h1 className={item.type}>{item[lang]}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>{lang === 'pl' ? 'Ilość:' : 'Count:'}</span>
            <input name="count" type="number" value={itemState.count} min={0} onChange={onChange} />
            <button type="button" onClick={onDecrementCount}>
              ➖
            </button>
            <button type="button" onClick={onIncrementCount}>
              ➕
            </button>
          </label>

          <label>
            <span>{lang === 'pl' ? 'Komentarz:' : 'Comment:'}</span>
            <select
              id="comment"
              value={itemState.comment}
              name="comment"
              disabled={newComment}
              onChange={onChange}
            >
              <option value=""></option>
              {existingComments.map((comment) => (
                <option key={comment} value={comment}>
                  {comment}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setNewComment(true)} disabled={newComment}>
              ➕
            </button>
          </label>

          {newComment && (
            <label>
              <span>{lang === 'pl' ? 'Dodaj nowy komentarz:' : 'Add new comment:'}</span>
              <textarea name="comment" value={itemState.comment} onChange={onChange} />
              <button type="button" onClick={() => setNewComment(false)}>
                ➖
              </button>
            </label>
          )}

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
          </footer>
        </form>
      </section>
    </main>
  );
}

export default Item;
