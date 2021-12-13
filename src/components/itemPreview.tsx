import React from 'react';
import { getItemDetails } from '../items';

function ItemPreview({ item, lang }) {
  const details = getItemDetails(item.key);

  if (!details) {
    return null;
  }

  return (
    <section className='item-preview'>
      {details && details[lang].map((prop) => {
        return <div key={prop} dangerouslySetInnerHTML={{ __html: prop }} />;
      })}
    </section>
  );
}

export default ItemPreview;
