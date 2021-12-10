import React from 'react';
import { getItemDetails } from '../../items';
import { ItemTypes } from '../../items/types';
import WeaponDetails from './weapon';

function ItemPreview({ item, lang }) {
  const details = getItemDetails(item.key);
  console.log({ details });

  return (
    <section className='item-preview'>
      <div className={details.isSet ? 'set' : 'unique'}>{details.name[lang]}</div>
      <div className={details.isSet ? 'set' : 'unique'}>{details.type[lang]}</div>
      {details.itemType === ItemTypes.WEAPON && <WeaponDetails details={details} lang={lang} />}
      {/*TODO ARMOR*/}
      {/*TODO OTHER*/}
      {/*TODO SET PROPERTIES*/}
    </section>
  );
}

export default ItemPreview;
