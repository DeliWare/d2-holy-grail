import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { USER_KEY } from '../config/localStorage';
import { useProfile, useSaveProfile } from '../hooks/resources';
import items from '../items';
import { getLocalStorage } from '../utils/localStorage';

function Item() {
  const params = useParams();
  const [{ data: profile }, executeProfile] = useProfile();
  const [, executeSave] = useSaveProfile();
  const lang = getLocalStorage('lang');
  const item = items.find((item) => item.key === params.itemKey);
  const navigate = useNavigate();

  const currentUserProfile = profile.find(
    (profile) => profile.user === Number(getLocalStorage(USER_KEY))
  );
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

    parsedUserData.data[params.itemKey] = { ...itemState, date: Date.now() };
    executeSave({ data: JSON.stringify(parsedUserData) })
      .then(() => executeProfile())
      .then(() => navigate(-1));
  };

  return (
    <main>
      <h1 className={item.type}>{item[lang === '🇵🇱' ? 'pl' : 'en']}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>{lang === '🇵🇱' ? 'Ilość:' : 'Count:'}</span>
          <input name="count" type="number" value={itemState.count} min={0} onChange={onChange} />
          <button type="button" onClick={onDecrementCount}>
            ➖
          </button>
          <button type="button" onClick={onIncrementCount}>
            ➕
          </button>
        </label>

        <label>
          <span>{lang === '🇵🇱' ? 'Komentarz:' : 'Comment:'}</span>
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
            <span>{lang === '🇵🇱' ? 'Dodaj nowy komentarz:' : 'Add new comment:'}</span>
            <input name="comment" type="text" value={itemState.comment} onChange={onChange} />
            <button type="button" onClick={() => setNewComment(false)}>
              ➖
            </button>
          </label>
        )}

        <label>
          <span>{lang === '🇵🇱' ? 'Idealny:' : 'Perfect:'}</span>
          <input
            name="perfect"
            type="checkbox"
            defaultChecked={itemState.perfect}
            onChange={() => setItemState({ ...itemState, perfect: !itemState.perfect })}
          />
        </label>

        <label>
          <span>{lang === '🇵🇱' ? 'Eteryczny:' : 'Etheral:'}</span>
          <input
            name="ethereal"
            type="checkbox"
            defaultChecked={itemState.ethereal}
            onChange={() => setItemState({ ...itemState, ethereal: !itemState.ethereal })}
          />
        </label>

        <footer>
          <button className="button-cta" type="submit">
            {lang === '🇵🇱' ? 'Zapisz' : 'Save'}
          </button>
        </footer>
      </form>
    </main>
  );
}

export default Item;
