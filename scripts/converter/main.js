'use strict';

const fs = require('fs');
const path = require("path");

const { baseItem } = require('./baseItem.js');
const { modifiedItem } = require('./modifiedItem.js');
const { d2Data } = require('./jsonData.js');
const { getItemProps } = require('./magicProperties.js');
const { formatItem } = require('./itemFormatted.js');
const { getItemName } = require('./utils.js');

function convert() {
  const items = { ...d2Data().uniqueItems, ...d2Data().setItems };
  const res = Object.keys(items)
    // .filter((item) => {
    //   return [
    //     'Boneslayer Blade'
    //     // 'Irices Shard'
    //     // 'Darksight Helm'
    //     // 'The Jade Tan Do'
    //     // 'The Humongous'
    //     // 'Goreshovel'
    //     // 'Lycander\'s Aim',
    //     // 'Herald of Zakarum',
    //     // 'Hellslayer',
    //     // 'Arm of King Leoric',
    //   ].includes(items[item].index);
    // })
    .map((key) => {
      const item = items[key];
      const base = baseItem(item);
      const props = getItemProps(item);
      const modified = modifiedItem(base, props);

      return formatItem({
        key,
        name: getItemName(item.index),
        base,
        modified,
        props,
      });
    });

  fs.writeFileSync(path.resolve(__dirname, '../../src/items/items.json'), JSON.stringify(res));
  console.log(`Success. Converted ${res.length} items`);
}

convert();
