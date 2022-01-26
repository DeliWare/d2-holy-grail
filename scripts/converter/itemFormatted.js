'use strict';

const {
  ITEM_TYPES_ENUM,
  CLASS_SET,
  CLASS_UNIQUE,
  CLASS_WHITE,
  CLASS_MAGIC,
  CLASS_REQUIREMENT
} = require('./constants.js');
const { getFlatPropertyValue } = require('./utils.js');
const {
  getCanBePerfect,
  getCanBeEthereal,
  getItemDurability,
  getClassRestriction
} = require('./utils.js');

function formatItem(item) {
  const isSet = item.isSet;
  const isArmor = item.itemType === ITEM_TYPES_ENUM.ARMOR;
  const isWeapon = item.itemType === ITEM_TYPES_ENUM.WEAPON;
  const isOther = item.itemType === ITEM_TYPES_ENUM.OTHER;
  const canBePerfect = getCanBePerfect(item);
  const canBeEthereal = getCanBeEthereal(item);
  const durability = getItemDurability(item);
  const classRestriction = getClassRestriction(item);
  const en = [];
  const pl = [];

  // Name
  en.push(`<span class='${isSet ? CLASS_SET : CLASS_UNIQUE}'>${item.name.en}</span>`);

  // Type
  en.push(`<span class='${isSet ? CLASS_SET : CLASS_UNIQUE}'>${item.base.type.en}</span>`);

  if (isWeapon) {
    // Damage
    if (item.modified.stats.dmgThrow.min) {
      en.push(`<span class='${CLASS_WHITE}'>Throw Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.modified.stats.dmgThrow.min)} to ${getFlatPropertyValue(item.modified.stats.dmgThrow.max)}</span>`);
    }

    if (item.modified.stats.dmg.min) {
      en.push(`<span class='${CLASS_WHITE}'>One-Hand Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.modified.stats.dmg.min)} to ${getFlatPropertyValue(item.modified.stats.dmg.max)}</span>`);
    }

    if (item.modified.stats.dmgTwoHanded.min) {
      en.push(`<span class='${CLASS_WHITE}'>Two-Hand Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.modified.stats.dmgTwoHanded.min)} to ${getFlatPropertyValue(item.modified.stats.dmgTwoHanded.max)}</span>`);
    }
  }

  if (isArmor) {
    if (item.modified.stats.armor) {
      en.push(`<span class='${CLASS_WHITE}'>Defense:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.modified.stats.armor.min)} to ${getFlatPropertyValue(item.modified.stats.armor.max)}</span>`);
    }
  }

  if (durability) {
    en.push(`<span class='${CLASS_WHITE}'>Durability: ${item.durability} of ${item.durability}</span>`);
  }

  if (classRestriction) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>[${classRestriction} Only]</span>`);
  }

  if (item.modified.stats.requiredDexterity) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>Required Dexterity: ${item.modified.stats.requiredDexterity}</span>`);
  }

  if (item.modified.stats.requiredStrength) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>Required Strength: ${item.modified.stats.requiredStrength}</span>`);
  }

  if (item.modified.stats.requiredLevel) {
    en.push(`<span class='${CLASS_WHITE}'>Required Level: ${item.modified.stats.requiredLevel}</span>`);
  }

  if (isWeapon) {
    en.push(`<span class='${CLASS_WHITE}'>${item.typeClass.en} -</span> <span class='${item.modified.stats.attackSpeed.value ? CLASS_MAGIC : CLASS_WHITE}'>${item.modified.stats.attackSpeed.en}</span>`);
  }

  item.props
    .filter(prop => !['dur'].includes(prop.key))
    .forEach((prop) => {
      en.push(`<span class='${CLASS_MAGIC}'>${prop.name.en}</span>`);
    });

  return {
    key: item.key,
    canBePerfect,
    canBeEthereal,
    item,
    en,
    pl: en
  };
}

module.exports = {
  formatItem
};