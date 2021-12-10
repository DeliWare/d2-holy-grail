import React from 'react';
import { getPropertyRangeOrValue } from '../../utils/itemHelpers';

function ItemProps({ itemProps, lang }) {
  return (
    <>
      {itemProps.map((prop) => {
        const percent = prop.key.includes('%');
        return <div className='magic' key={prop.key}>
          {getPropertyRangeOrValue([prop.min, prop.max])}{percent && '%'}{' '}{prop.name[lang]}
        </div>;
      })}
    </>
  );
}

export default ItemProps;
