'use strict';

const { d2Data } = require('./jsonData.js');
const {
  findString,
  getPropertyRangeOrValue,
  getSkill,
  getPercentPropertyValue,
  getCharAllSkillString,
  getSkillName,
  getFlatPropertyValue,
  getCharTreeString,
} = require('./utils.js');
const { CHARACTER_LEVEL, FRAME_LENGTH } = require('./constants.js');

function getPropData(propNumber, key, item) {
  const prop = {
    key,
    min: item[`min${propNumber}`],
    max: item[`max${propNumber}`],
    par: item[`par${propNumber}`]
  };

  if (key === 'fire-min') {
    prop.max = item[`min${propNumber + 1}`];
  }

  if (key === 'pois-min') {
    prop.par = item[`min${propNumber + 2}`];
  }

  if (['fire-max', 'pois-max', 'pois-len', '*enr'].includes(key)) {
    return null;
  }

  const parsedPropKey = prop.key.replace('*', ''); // TODO why?
  const property = Object.entries(d2Data().properties).find(([key]) => {
    return key === parsedPropKey;
  });

  if (!property) {
    console.warn(`Translation properties not found for ${prop.key}`);
    return {
      ...prop,
      name: {
        en: prop.key,
        pl: prop.key
      }
    };
  }

  // TODO functions can be 7
  const calculatedProp = executePropFunction({
    set: property[1].set1,
    val: property[1].val1,
    func: property[1].func1,
    stat: property[1].stat1
  }, prop);

  const hideMaxMin = [11].includes(property[1].func1); // hide
  return {
    ...prop,
    ...(hideMaxMin && { max: null, min: null }),
    ...calculatedProp
  };
}

function executePropFunction({ set, val, func, stat }, propData) {
  let itemStatCost = d2Data().itemStatCost[stat];
  let fixedValues = propData.min === propData.max;
  let translation;
  let percent = propData.key.includes('%') || [
    'cast1',
    'crush',
    'swing1',
    'swing2',
    'swing3',
    'move2',
    'deadly',
    'res-all',
    'res-fire',
    'res-cold',
    'res-ltng',
    'res-pois',
    'res-cold-max',
    'res-pois-max',
    'res-fire-max',
    'res-ltng-max',
    'block',
    'block2',
    'ease',
    'openwounds',
    'item_maxdamage_percent_perlevel',
    'item_damage_undead_perlevel',
    'dmg-undead',
    'extra-fire',
    'extra-cold',
    'extra-ltng',
    'extra-pois',
    'pierce-fire',
    'pierce-cold',
    'pierce-pois',
    'pierce-ltng'
  ].includes(propData.key);

  switch (func) {
    // case 3:
    //   m(stat, null, resultMaybe);
    //   break;
    case 5:
      itemStatCost = d2Data().itemStatCost['mindamage'];
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + findString(itemStatCost.descstrpos);
      break;
    case 6:
      itemStatCost = d2Data().itemStatCost['maxdamage'];
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + findString(itemStatCost.descstrpos);
      break;
    case 7:
      itemStatCost = d2Data().itemStatCost['maxdamage'];
      translation = getPropertyRangeOrValue([propData.min, propData.max], true) + findString('strModEnhancedDamage');
      break;
    case 10:
      translation = getCharTreeString(propData.par).replace('+%d ', getPropertyRangeOrValue([propData.min, propData.max]));
      break;
    case 11:
      const skill = getSkill(propData.par);
      translation = findString(itemStatCost.descstrpos);
      translation = translation.replace('%d%', propData.min);
      if (propData.max === 0) {
        let skillLevel;
        // TODO get formula instead of fixed ranges
        switch (skill.skill) {
          case 'Holy Bolt':
            skillLevel = '12-20';
            fixedValues = false;
            break;
          case 'Meteor':
            skillLevel = '13-19';
            fixedValues = false;
            break;
          case 'Blizzard':
            skillLevel = '7-19';
            fixedValues = false;
            break;
          default:
            skillLevel = Math.round((99 - skill.reqlevel + 1) / 3.9);
        }
        translation = translation.replace('%d', skillLevel);
      } else {
        translation = translation.replace('%d', propData.max);
        fixedValues = true;
      }
      translation = translation.replace('%s', skill.skill);
      break;
    case 12:
      translation = `+${propData.par} to [random skill] ([Class] Only]`;
      fixedValues = true;
      break;
    case 14:
      translation = `${findString('Socketable')} (${getFlatPropertyValue([propData.min, propData.max])}})}`;
      break;
    // case 15:
    //   m(stat, null, a);
    //   break;
    // case 16:
    //   m(stat, null, r);
    //   break;
    case 17:
      fixedValues = true;
      let minMax = {
        6: [Math.floor(CHARACTER_LEVEL * (propData.par / 2))],
        8: [Math.floor(CHARACTER_LEVEL * (propData.par / 8))]
      }[itemStatCost.descfunc] || [Math.floor(CHARACTER_LEVEL * (propData.par / 8))];

      translation = getPropertyRangeOrValue(minMax, percent) + findString(itemStatCost.descstrpos) + ' ' + findString('increaseswithplaylevelX');

      if (['item_replenish_quantity'].includes(stat)) {
        translation = findString(itemStatCost.descstrpos) + ' ' + propData.par;
      }
      if (['item_replenish_durability'].includes(stat)) {
        translation = findString('ModStre9u').replace('%d', 1).replace('%d', 100 / propData.par);
      }
      break;
    case 19:
      const skill19 = getSkill(propData.par);
      translation = findString(itemStatCost.descstrpos);
      translation = `${findString('strchrlvl')} ${propData.max} ${skill19.skill} ${translation.replace('%d', propData.min).replace('%d', propData.min)}`;
      break;
    case 20:
      itemStatCost = d2Data().itemStatCost['item_indesctructible'];
      translation = findString(itemStatCost.descstrpos);
      fixedValues = true;
      break;
    case 21:
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + getCharAllSkillString(val);
      break;
    case 22:
    case 24:
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + getSkillName(propData.par);
      break;
    case 23:
      translation = 'Ethereal (Cannot be Repaired)';
      fixedValues = true;
      break;
    // case 36:
    //   m(stat, ''.concat(val, '#x'), i);
    //   break;
    default:

      switch (propData.key) {
        case 'res-all':
          translation = findString('strModAllResistances')
            .replace('+%d', getPropertyRangeOrValue([propData.min, propData.max], false));
          break;
        case 'explosivearrow':
        case 'nofreeze':
          // case 'stupidity':
          translation = findString(itemStatCost.descstrpos);
          fixedValues = true;
          break;
        case 'manasteal':
        case 'lifesteal':
          translation = getPercentPropertyValue([propData.min, propData.max]) + findString(itemStatCost.descstrpos);
          break;
        case 'res-pois-len':
          translation = findString(itemStatCost.descstrpos) + ' ' + getPropertyRangeOrValue([propData.min, propData.max], true, true);
          break;
        case 'red-dmg':
        case 'red-mag':
          translation = findString(itemStatCost.descstrpos) + ' ' + getPropertyRangeOrValue([propData.min, propData.max], false, true);
          break;
        case 'dmg-norm':
          translation = findString('strModMinDamageRange')
            .replace('%d', propData.min)
            .replace('%d', propData.max);
          break;
        case 'dmg-mag':
          translation = findString('strModMagicDamageRange')
            .replace('%d', propData.min)
            .replace('%d', propData.max);
          break;
        case 'pierce-fire':
        case 'pierce-cold':
        case 'pierce-pois':
        case 'pierce-ltng':
          translation = getPropertyRangeOrValue([-propData.min, -propData.max], percent) + findString(itemStatCost.descstrpos);
          break;
        case 'fire-min':
        case 'dmg-fire':
          translation = findString('strModFireDamageRange')
            .replace('%d', propData.min)
            .replace('%d', propData.max);
          break;
        case 'pois-min':
        case 'dmg-pois':
          translation = findString('strModPoisonDamage')
            .replace('%d', Math.round(propData.min * propData.par / 256))
            .replace('%d', propData.par / FRAME_LENGTH);
          fixedValues = true;
          break;
        case 'thorns':
        case 'light-thorns':
          translation = findString(itemStatCost.descstrpos) + ' ' + getFlatPropertyValue([propData.min, propData.max]);
          break;
        case 'slow':
        case 'regen-mana':
          translation = findString(itemStatCost.descstrpos) + ' ' + getPercentPropertyValue([propData.min, propData.max]);
          break;
        case 'knock':
        case 'half-freeze':
          translation = findString(itemStatCost.descstrpos);
          fixedValues = true;
          break;
        default:
          if ([
            'poisonlength',
            'coldlength',
            'item_extrablood',
            'item_fastergethitrate',
            'maxdurability'
          ].includes(stat)) { // todo
            translation = stat;
          } else {
            translation = getPropertyRangeOrValue([propData.min, propData.max], percent) + findString(itemStatCost.descstrpos);
          }
      }
  }

  return {
    stat,
    func,
    priority: (itemStatCost ? itemStatCost.descpriority || 0 : 0) + .001 * (itemStatCost ? itemStatCost.id || 0 : 0),
    fixedValues,
    name: {
      en: translation,
      pl: translation
    }
  };
}

function getItemProps(item) {
  return Object.entries(item)
    .filter(([key]) => {
      return key.startsWith('prop');
    })
    .map(([key, value]) => {
      const propNumber = parseInt(key.slice(4), 10);
      return getPropData(propNumber, value, item);
    })
    .filter((prop) => prop)
    .sort((a, b) => b.priority - a.priority);
}

module.exports = { getItemProps };