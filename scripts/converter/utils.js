'use strict';

const { strings, d2Data, itemNames } = require('./jsonData.js');
const {
  CHARACTERS,
  ITEMS_NOT_ETHEREAL,
  ITEMS_WITHOUT_DURABILITY
} = require('./constants.js');

function findString(key) {
  return strings().find((string) => Array.isArray(string) && string[0] === key)[1];
}

function getPercentPropertyValue(value) {
  return getPropertyRangeOrValue(Array.isArray(value) ? value : [value], true, true) + ' ';
}

function getPlusPercentPropertyValue(value) {
  return getPropertyRangeOrValue(Array.isArray(value) ? value : [value], true, false);
}

function getFlatPropertyValue(value) {
  return getPropertyRangeOrValue(Array.isArray(value) ? value : [value], false, true);
}

function getPropertyRangeOrValue(values, percent, disablePrefixSuffix) {
  if (!values || !Array.isArray(values) || values.length === 0) {
    return '';
  }

  const isSame = values[1] === undefined || values[0] === values[1];
  let prefix = values[0] >= 0 ? '+' : '';
  let suffix = ' ';

  if (disablePrefixSuffix) {
    prefix = '';
    suffix = '';
  }
  return isSame ? `${prefix}${values[0]}${percent ? '%' : ''}${suffix}` : `${prefix}${values[0]}-${values[1]}${percent ? '%' : ''}${suffix}`;
}

function getSkillName(id) {
  const skillData = d2Data().skills[id];
  if (!skillData) {
    return 'to UNKNOWN';
  }

  return `to ${skillData.skill} (${CHARACTERS[skillData.charclass]} Only)`;
}

function getSkill(id) {
  return d2Data().skills[id];
}

function getCharAllSkillString(index) {
  const charStats = d2Data().charStats;

  const res = Object.values(charStats).reduce((acc, val) => {
    return [
      ...acc,
      val.strallskills
    ];
  }, []);

  return findString(res[index]);
}

function getCharTreeString(index) {
  const charStats = d2Data().charStats;

  const res = Object.values(charStats).reduce((acc, val) => {
    return [
      ...acc,
      {
        class: val.class,
        skillTab: val.strskilltab1
      },
      {
        class: val.class,
        skillTab: val.strskilltab2
      },
      {
        class: val.class,
        skillTab: val.strskilltab3
      }
    ];
  }, []);

  const tab = res[index];

  return `${findString(tab.skillTab)} (${tab.class} Only)`;
}

function getCanBePerfect(item) {
  return item.props.every((prop) => prop.fixedValues);
}

function getCanBeEthereal(item) {
  const weaponClass = item.base.stats.weaponClass;

  return !ITEMS_NOT_ETHEREAL.includes(weaponClass);
}

function getItemDurability(item) {
  const indestructible = item.props.some((prop) => prop.key === 'indestruct');
  if (indestructible) {
    return 0;
  }
  const maxDurability = item.props.find((prop) => prop.key === 'dur');
  if (maxDurability) {
    item.durability = item.durability + maxDurability.min;
  }

  const weaponClass = item.base.stats.weaponClass;

  return ITEMS_WITHOUT_DURABILITY.includes(weaponClass) ? null : item.durability || 0;
}

function getClassRestriction(item) {
  // todo items
  const ITEM_RESTRICTIONS = [
    {
      items: ['nea', 'ne5', 'nef'],
      class: 'Necromancer'
    },
    {
      items: ['am2', 'am7', 'amc', 'am1', 'am6', 'amb', 'am5', 'ama', 'amf', 'am9', 'am4', 'ame', 'am3', 'am8', 'amd'],
      class: 'Amazon'
    },
    {
      items: [],
      class: 'Assassin'
    },
    {
      items: [],
      class: 'Barbarian'
    },
    {
      items: [],
      class: 'Druid'
    },
    {
      items: ['pa4', 'pa9', 'pae'],
      class: 'Paladin'
    },
    {
      items: ['ob5', 'oba', 'obf'],
      class: 'Sorceress'
    }
  ];
  const result = ITEM_RESTRICTIONS.find((restriction) => {
    return restriction.items.includes(item.base.type.key);
  });

  return result ? result.class : false;
}

function getItemName(index) {
  return {
    key: index,
    ...itemNames()[index],
  }
}

module.exports = {
  findString,
  getPercentPropertyValue,
  getPlusPercentPropertyValue,
  getFlatPropertyValue,
  getPropertyRangeOrValue,
  getSkillName,
  getSkill,
  getCharAllSkillString,
  getCharTreeString,
  getCanBePerfect,
  getCanBeEthereal,
  getItemDurability,
  getClassRestriction,
  getItemName,
};