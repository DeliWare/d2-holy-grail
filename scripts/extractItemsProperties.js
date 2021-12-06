const fs = require('fs');

let strings = null;
let data = null;

function getStrings() {
  if (strings === null) {
    strings = JSON.parse(fs.readFileSync('./data/strings.json', 'utf8'));
  }

  return strings;
}

function getData() {
  if (data === null) {
    data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
  }

  return data;
}

function getProData(propKey) {
  const property = Object.entries(data.properties).find(([key]) => {
    return key === propKey;
  });

  if (!property) {
    console.warn(`Translation properties not found for ${propKey}`);
    return {
      en: propKey,
      pl: propKey
    };
  }

  const itemStatCost = Object.entries(data.itemStatCost).find(([key]) => key === property[1].stat1);

  if (!itemStatCost) {
    console.warn(`Translation itemStatCost not found for ${propKey}`);
    return {
      en: propKey,
      pl: propKey
    };
  }

  const translation = strings.find((string) => Array.isArray(string) && string[0] === itemStatCost[1].descstrpos);

  return {
    en: translation ? translation[1] : propKey,
    pl: translation ? translation[1] : propKey,
    itemStatCost: itemStatCost[1],
  };
}

function getItemProps(item) {
  return Object.entries(item)
    .filter(([key]) => {
      return key.startsWith('prop');
    })
    .map(([key, value]) => {
      const propNumber = parseInt(key.slice(4), 10);

      return {
        key: value,
        ...getProData(value),
        min: item[`min${propNumber}`],
        max: item[`max${propNumber}`]
      };
    });
}

function convert() {
  getStrings();
  getData();

  const res = Object.keys(data.uniqueItems)
    .filter((key, index) => { // TODO remove
      return index < 10;
    })
    .map((key) => {
      const item = data.uniqueItems[key];

      return {
        key,
        props: getItemProps(item),
        item,
      };
    });

  fs.writeFileSync('./data_parsed.json', JSON.stringify(res));
  console.log('Success');
}

convert();
