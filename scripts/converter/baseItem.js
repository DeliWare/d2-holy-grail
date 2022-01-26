'use strict';

const { d2Data } = require('./jsonData.js');
const { ITEM_TYPES_ENUM, CHARACTER_CLASSES_SHORT, WEAPON_ATTACK_SPEED } = require('./constants.js');
const { findString } = require('./utils.js');

function getAttackSpeed(baseAttackSpeed, weaponClass) {
  const index = CHARACTER_CLASSES_SHORT.indexOf('sor');
  let attackSpeed = baseAttackSpeed;

  const speedBreakpoints = WEAPON_ATTACK_SPEED[weaponClass][index];
  const translation = attackSpeed >= speedBreakpoints[3] ? findString('WeaponAttackVerySlow') :
    attackSpeed >= speedBreakpoints[2] ? findString('WeaponAttackSlow') :
      attackSpeed >= speedBreakpoints[1] ? findString('WeaponAttackNormal') :
        attackSpeed >= speedBreakpoints[0] ? findString('WeaponAttackFast') :
          findString('WeaponAttackVeryFast');

  return {
    attackSpeed: {
      value: attackSpeed,
      en: translation,
      pl: translation
    }
  };
}

function getWeaponStats(itemDetails, item) {
  const twoHanded = itemDetails['2handed'] === 1;
  const dmgBase = {
    min: itemDetails.mindam,
    max: itemDetails.maxdam
  };
  const dmgTwoHandedBase = {
    min: itemDetails['2handmindam'],
    max: itemDetails['2handmaxdam']
  };
  const dmgThrowBase = {
    min: itemDetails.minmisdam,
    max: itemDetails.maxmisdam
  };

  return {
    twoHanded,
    dmg: dmgBase,
    dmgTwoHanded: dmgTwoHandedBase,
    dmgThrow: dmgThrowBase,
    weaponClass: itemDetails.wclass || 'unknown', // ['1hs', 'stf', '1ht', '2ht', 'bow', 'xbw', 'ht1']
    ...getAttackSpeed(itemDetails.speed || 0, itemDetails.wclass),
    requiredStrength: itemDetails.reqstr || 0,
    requiredDexterity: itemDetails.reqdex || 0,
    requiredLevel: item.lvlreq || 0
  };
}

function getArmorStats(itemDetails, item) {
  let armorBase = {
    min: itemDetails.minac,
    max: itemDetails.maxac
  };

  return {
    armorClass: itemDetails.type || 'unknown', // ['pelt', 'phlm', 'head', 'ashd', 'amaz', 'rod']
    armorBase,
    requiredStrength: itemDetails.reqstr || 0,
    requiredDexterity: itemDetails.reqdex || 0,
    requiredLevel: item.lvlreq || 0
  };
}

function getOtherStats(itemDetails, item) {
  return {
    requiredLevel: item.lvlreq || 0
  };
}

function getTypeClass(type) {
  const types = {
    axe: 'WeaponDescAxe',
    swor: 'WeaponDescSword',
    knif: 'WeaponDescDagger',
    spea: 'WeaponDescSpear',
    jave: 'WeaponDescJavelin',
    pole: 'WeaponDescPoleArm',
    club: 'WeaponDescMace',
    hamm: 'WeaponDescMace',
    mace: 'WeaponDescMace',
    scep: 'WeaponDescMace',
    wand: 'WeaponDescStaff',
    staf: 'WeaponDescStaff',
    orb: 'WeaponDescStaff',
    h2h: 'WeaponDescH2H',
    bow: 'WeaponDescBow',
    xbow: 'WeaponDescCrossBow',
    tpot: 'WeaponDescThrownPotion'
  };

  const key = types[type];
  return key ? findString(types[type]) : type;
}

function baseItem(item) {
  const weapons = d2Data().weapons;
  const armors = d2Data().armor;
  const misc = d2Data().misc;

  let itemDetails = null;
  let itemType = null;

  if (weapons[item.code] || weapons[item.item]) {
    itemType = ITEM_TYPES_ENUM.WEAPON;
    itemDetails = weapons[item.code] || weapons[item.item];
  } else if (armors[item.code] || armors[item.item]) {
    itemType = ITEM_TYPES_ENUM.ARMOR;
    itemDetails = armors[item.code] || armors[item.item];
  } else if (misc[item.code] || misc[item.item]) {
    itemType = ITEM_TYPES_ENUM.OTHER;
    itemDetails = misc[item.code] || misc[item.item];
  } else {
    console.warn('ITEM TYP NOT DETECTED', item);
    return;
  }

  const tier = itemDetails.code === itemDetails.ultracode ? 3 : itemDetails.code === itemDetails.ubercode ? 2 : 1;

  return {
    itemType,
    type: {
      key: item.code,
      en: itemDetails.name,
      pl: itemDetails.name
    },
    typeClass: {
      key: itemDetails.type,
      en: getTypeClass(itemDetails.type),
      pl: getTypeClass(itemDetails.type)
    },
    ...(itemType === ITEM_TYPES_ENUM.WEAPON && { stats: getWeaponStats(itemDetails, item) }),
    ...(itemType === ITEM_TYPES_ENUM.ARMOR && { stats: getArmorStats(itemDetails, item) }),
    ...(itemType === ITEM_TYPES_ENUM.OTHER && { stats: getOtherStats(itemDetails, item) }),
    durability: itemDetails.durability || null,
    set: item.set || null,
    isSet: !!item.set,
    tier,
    tierName: ['None', 'Normal', 'Exceptional', 'Elite'][tier],
    rarity: itemDetails.rarity || 0
  };
}

module.exports = { baseItem, getAttackSpeed };