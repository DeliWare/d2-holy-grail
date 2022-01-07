import runes from './runes.json';
import grailItems from './items.json';
import { Item, ItemDetails, ItemAttr } from './types';

const getItemDetails = (itemKey): ItemDetails => {
  return grailItems.find(({ key }) => key === itemKey);
};

const getItemAttributes = (itemKey): ItemAttr | Partial<ItemAttr> => {
  const details = getItemDetails(itemKey);
  if (!details) {
    return {};
  }

  const {
    item: { isSet, set, itemType, rarity, tier, tierName, typeClass, type }
  } = details;

  return {
    isSet,
    set,
    itemType,
    rarity,
    tier,
    tierName,
    type,
    typeClass
  };
};

const mapItemNames = (items, type, customSearch = ''): Item[] =>
  items.map(({ item, key, name }) => {
    const en = item?.name?.en || item?.name?.key || name || key;
    const pl = item?.name?.pl || en;
    const attr = getItemAttributes(key);
    const search = `${en} ${pl} ${customSearch} ${attr?.set}`.trim().toLowerCase();

    return {
      key,
      en,
      pl,
      search,
      type,
      attr
    };
  });

const armorItems = grailItems.filter(
  ({ item: { itemType, isSet } }) => itemType === 'Armor' && !isSet
);
const weaponItems = grailItems.filter(
  ({ item: { itemType, isSet } }) => itemType === 'Weapon' && !isSet
);
const otherItems = grailItems.filter(
  ({ item: { itemType, isSet } }) => itemType === 'Other' && !isSet
);
const setItems = grailItems.filter(({ item: { isSet } }) => isSet);
const runeItems = Object.entries(runes).map(([key, name]: [string, string]) => ({ key, name }));

const items: Item[] = [
  ...mapItemNames(weaponItems, 'unique-weapon', 'uniques unikaty waepon broń'),
  ...mapItemNames(armorItems, 'unique-armor', 'uniques unikaty armor pancerz'),
  ...mapItemNames(
    otherItems,
    'unique-other',
    'uniques unikaty jewlery bizuteria talizman amulet pierscien ring'
  ),
  ...mapItemNames(setItems, 'set', 'sets sety zestawy'),
  ...mapItemNames(runeItems, 'rune', 'runes runa runy')
];

export { items as default, getItemDetails };
