'use strict';

const { ITEM_TYPES_ENUM, CHARACTER_LEVEL } = require('./constants.js');
const { getAttackSpeed } = require('./baseItem.js');

function calculateItemDmg({ min, max }, props) {
  const result = {
    min: [min, min],
    max: [max, max]
  };

  const dmgPercent = props.find(({ key }) => key === 'dmg%');
  const dmgMaxPerLvl = props.find(({ key }) => key === 'dmg%/lvl');
  if (dmgPercent || dmgMaxPerLvl) {
    const dmgMaxPerLvlMax = dmgMaxPerLvl ? Math.floor(CHARACTER_LEVEL * 3) : 0;

    result.min[0] = Math.floor(result.min[0] * (1 + (dmgPercent.min) / 100));
    result.min[1] = Math.floor(result.min[1] * (1 + (dmgPercent.max) / 100));
    result.max[0] = Math.floor(result.max[0] * (1 + (dmgPercent.min + dmgMaxPerLvlMax) / 100));
    result.max[1] = Math.floor(result.max[1] * (1 + (dmgPercent.max + dmgMaxPerLvlMax) / 100));
  }

  const dmgNormal = props.find(({ key }) => key === 'dmg-norm');
  if (dmgNormal) {
    result.min[0] = result.min[0] + dmgNormal.min;
    result.min[1] = result.min[1] + dmgNormal.min;
    result.max[0] = result.max[0] + dmgNormal.max;
    result.max[1] = result.max[1] + dmgNormal.max;
  }

  const dmgMin = props.find(({ key }) => key === 'dmg-min');
  if (dmgMin) {
    result.min[0] = result.min[0] + dmgMin.min;
    result.min[1] = result.min[1] + dmgMin.max;
  }

  const dmgMax = props.find(({ key }) => key === 'dmg-max');
  if (dmgMax) {
    result.max[0] = result.max[0] + dmgMax.min;
    result.max[1] = result.max[1] + dmgMax.max;
  }

  const dmgFlat = props.find(({ key }) => key === 'dmg');
  if (dmgFlat) {
    result.min[0] = result.min[0] + dmgFlat.min;
    result.min[1] = result.min[1] + dmgFlat.min;
    result.max[0] = result.max[0] + dmgFlat.max;
    result.max[1] = result.max[1] + dmgFlat.max;
  }

  // TODO dmg/lvl ?

  return result;
}

function getModifiedAttackSpeed(baseAttackSpeed, props, weaponClass) {
  let attackSpeed = baseAttackSpeed;

  const swing1 = props.find(({ key }) => key === 'swing1');
  if (swing1) {
    attackSpeed = attackSpeed - swing1.min;
  }

  const swing2 = props.find(({ key }) => key === 'swing2');
  if (swing2) {
    attackSpeed = attackSpeed - swing2.min;
  }

  const swing3 = props.find(({ key }) => key === 'swing3');
  if (swing3) {
    attackSpeed = attackSpeed - swing3.min;
  }

  return getAttackSpeed(attackSpeed, weaponClass);
}

function calculateRequirement(defaultValue, props) {
  let result = defaultValue;

  const ease = props.find(({ key }) => key === 'ease');
  if (ease) {
    result = Math.ceil(result * (1 + ease.min / 100));
  }

  return result;
}

function getWeaponStats(base, props) {
  const dmgBase = base.stats.dmg;
  const dmgTwoHandedBase = base.stats.dmgTwoHanded;
  const dmgThrowBase = base.stats.dmgThrow;

  return {
    dmg: calculateItemDmg(dmgBase, props),
    dmgTwoHanded: calculateItemDmg(dmgTwoHandedBase, props),
    dmgThrow: calculateItemDmg(dmgThrowBase, props),
    ...getModifiedAttackSpeed(base.stats.attackSpeed.value, props, base.stats.weaponClass),
    requiredStrength: calculateRequirement(base.stats.requiredStrength || 0, props),
    requiredDexterity: calculateRequirement(base.stats.requiredDexterity || 0, props)
  };
}

function calculateItemArmor({ min, max }, props) {
  const result = {
    min,
    max
  };

  const ac = props.find(({ key }) => key === 'ac%');
  if (ac) {
    result.min = result.min + 1;
    result.max = result.max + 1;
    result.min = Math.floor(result.min * (1 + (ac.min) / 100));
    result.max = Math.floor(result.max * (1 + (ac.max) / 100));
  }

  const acLvl = props.find(({ key }) => key === 'ac/lvl');
  if (acLvl) {
    result.max = result.max + Math.floor(CHARACTER_LEVEL * 2);
  }

  return result;
}

function getArmorStats(base, props) {
  const armorBase = base.stats.armorBase;

  return {
    armor: calculateItemArmor(armorBase, props),
    requiredStrength: calculateRequirement(base.stats.requiredStrength || 0, props),
    requiredDexterity: calculateRequirement(base.stats.requiredDexterity || 0, props)
  };
}

function getOtherStats(base, props) {
  return base;
}

function modifiedItem(base, props) {
  return {
    ...(base.itemType === ITEM_TYPES_ENUM.WEAPON && { stats: getWeaponStats(base, props) }),
    ...(base.itemType === ITEM_TYPES_ENUM.ARMOR && { stats: getArmorStats(base, props) }),
    ...(base.itemType === ITEM_TYPES_ENUM.OTHER && { stats: getOtherStats(base, props) }),
    durability: base.durability || null
  };
}

module.exports = { modifiedItem };