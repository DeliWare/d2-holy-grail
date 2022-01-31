export interface Item {
  key: string;
  en: string;
  pl: string;
  search: string;
  type: 'unique-weapon' | 'unique-armor' | 'unique-other' | 'set' | 'rune';
  attr: ItemAttr;
  value?: ItemValue;
}

export interface ItemAttr {
  isSet?: boolean;
  set?: string;
  itemType?: any; // TODO
  rarity?: number;
  tier?: number;
  tierName?: string;
  type?: any; // TODO
  typeClass?: any; // TODO
}

export interface ItemDetails {
  key: string;
  canBePerfect: boolean;
  canBeEthereal: boolean;
  item: any; // TODO
  en: string[];
  pl: string[];
}

export interface ItemValue {
  value: string;
  details: string;
  statPriority: string;
}
