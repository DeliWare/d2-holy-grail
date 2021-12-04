import React from 'react';
import { useParams } from 'react-router';
import items from '../items';

function Item() {
  const params = useParams();
  const item = items.find((item) => item.key === params.itemKey);

  console.info(item);

  return <main>{params.itemKey}</main>;
}

export default Item;
