import itemNames from './itemNames.json';
import runes from './runes.json';
import setItems from './setItems.json';
import uniqueItems from './uniqueItems.json';

const mapItemNames = (items, type) =>
  Object.entries(items).map(([key, name]: [string, string]) => {
    const en = itemNames[name]?.en || name || '';
    const pl = itemNames[name]?.pl || en;
    const search = `${en} ${pl}`.trim().toLowerCase();

    return {
      key,
      en,
      pl,
      search,
      type,
    };
  });

const items = [
  ...mapItemNames(runes, 'rune'),
  ...mapItemNames(setItems, 'set'),
  ...mapItemNames(uniqueItems, 'unique'),
];

export default items;
