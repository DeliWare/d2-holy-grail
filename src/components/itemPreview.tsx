import React from 'react';
import { getItemDetails } from '../items';

function ItemPreview({ item, lang }) {
  const details = getItemDetails(item.key);
  console.log({ details });

  return (
    <section className='item-preview'>
      {details[lang].map((prop) => {
        return <div key={prop.key} dangerouslySetInnerHTML={{ __html: prop }}/>;
      })}
    </section>
  );
}

export default ItemPreview;
