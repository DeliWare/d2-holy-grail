/* eslint-disable no-case-declarations */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

let strings = null;
let data = null;
let itemNames = null;

const ITEM_TYPES_ENUM = {
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  OTHER: 'Other'
};

const CHARACTER_LEVEL = 99;
const FRAME_LENGTH = 25;

function loadStrings() {
  if (strings === null) {
    strings = JSON.parse(fs.readFileSync('./data/strings.json', 'utf8'));
  }

  return strings;
}

function loadData() {
  if (data === null) {
    data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
  }

  return data;
}

function loadItemNames() {
  if (itemNames === null) {
    itemNames = JSON.parse(fs.readFileSync('../src/items/itemNames.json', 'utf8'));
  }

  return itemNames;
}

function findString(key) {
  return strings.find((string) => Array.isArray(string) && string[0] === key)[1];
}

const CHARACTERS = {
  ama: 'Amazon',
  sor: 'Sorceress',
  nec: 'Necromancer',
  pal: 'Paladin',
  bar: 'Barbarian',
  dru: 'Druid',
  ass: 'Assassin'
};

function getSkillName(id) {
  const skillData = data.skills[id];
  if (!skillData) {
    return 'to UNKNOWN';
  }

  return `to ${skillData.skill} (${CHARACTERS[skillData.charclass]} Only)`;
}

function getSkill(id) {
  return data.skills[id];
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

function executePropFunction({ set, val, func, stat }, propData) {
  let itemStatCost = data.itemStatCost[stat];
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
      itemStatCost = data.itemStatCost['mindamage'];
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + findString(itemStatCost.descstrpos);
      break;
    case 6:
      itemStatCost = data.itemStatCost['maxdamage'];
      translation = getPropertyRangeOrValue([propData.min, propData.max], false) + findString(itemStatCost.descstrpos);
      break;
    case 7:
      itemStatCost = data.itemStatCost['maxdamage'];
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
      let minMax = [CHARACTER_LEVEL * (propData.par / 8)];
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
      itemStatCost = data.itemStatCost['item_indesctructible'];
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

  if (['fire-max', 'pois-max', 'pois-len'].includes(key)) {
    return null;
  }

  const parsedPropKey = prop.key.replace('*', ''); // TODO why?
  const property = Object.entries(data.properties).find(([key]) => {
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

function calculateItemDmg({ min, max }, item) {
  const props = getItemProps(item);
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

function getAttackSpeed(baseAttackSpeed, item, itemDetails) {
  // For different classes different ranges are used.
  // For some reasons default is sor.
  const classes = ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass'];
  const weaponAttackSpeed = {
    ht1: [
      [-99, -99, -99, -99],
      [-99, -99, -99, -99],
      [-99, -99, -99, -99],
      [-99, -99, -99, -99],
      [-99, -99, -99, -99],
      [-99, -99, -99, -99],
      [3, 21, 33, 39]
    ],
    '1hs': [
      [-10, 7, 18, 34],
      [-20, 0, 15, 26],
      [-18, 1, 18, 27],
      [-7, 12, 21, 35],
      [-14, 6, 16, 31],
      [-18, 5, 14, 24],
      [-7, 12, 26, 32]
    ],
    '1ht': [
      [1, 14, 24, 38],
      [-13, 6, 19, 29],
      [-18, 1, 18, 27],
      [-21, 0, 11, 26],
      [-14, 6, 16, 31],
      [-18, 5, 14, 24],
      [-7, 12, 26, 32]
    ],
    '2ht': [
      [-23, -7, 6, 24],
      [-40, -16, 1, 13],
      [-49, -26, -4, 8],
      [-42, -17, -5, 13],
      [-35, -12, 1, 18],
      [-43, -15, -4, 8],
      [-64, -35, -15, -4]
    ],
    stf: [
      [-38, -20, 1, 15],
      [-12, 7, 24, 34],
      [-24, -5, 13, 24],
      [-28, 1, 8, 22],
      [-35, -12, 1, 18],
      [-6, 15, 23, 32],
      [-35, -12, 5, 14]
    ],
    bow: [
      [-7, 7, 18, 34],
      [-13, 6, 19, 29],
      [-12, 6, 22, 31],
      [-14, 6, 16, 31],
      [-7, 12, 21, 35],
      [1, 20, 27, 36],
      [-14, 6, 20, 27]
    ],
    xbw: [
      [-53, -33, -17, 5],
      [-33, -11, 5, 17],
      [-24, -5, 13, 24],
      [-42, -17, -5, 13],
      [-42, -17, -5, 13],
      [-24, 1, 9, 20],
      [-49, -23, -5, 5]
    ]
  };

  const props = getItemProps(item);
  const index = classes.indexOf('sor');
  const weaponClass = itemDetails.wclass;
  let attackSpeed = baseAttackSpeed;
  let modified = false;

  const swing1 = props.find(({ key }) => key === 'swing1');
  if (swing1) {
    attackSpeed = attackSpeed - swing1.min;
    modified = true;
  }
  const swing2 = props.find(({ key }) => key === 'swing2');
  if (swing2) {
    attackSpeed = attackSpeed - swing2.min;
    modified = true;
  }
  const swing3 = props.find(({ key }) => key === 'swing3');
  if (swing3) {
    attackSpeed = attackSpeed - swing3.min;
    modified = true;
  }

  const speedBreakpoints = weaponAttackSpeed[weaponClass][index];
  const translation = attackSpeed >= speedBreakpoints[3] ? findString('WeaponAttackVerySlow') :
    attackSpeed >= speedBreakpoints[2] ? findString('WeaponAttackSlow') :
      attackSpeed >= speedBreakpoints[1] ? findString('WeaponAttackNormal') :
        attackSpeed >= speedBreakpoints[0] ? findString('WeaponAttackFast') :
          findString('WeaponAttackVeryFast');

  return {
    attackSpeed: {
      modified,
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
    weaponClass: itemDetails.wclass || 'unknown', // ['1hs', 'stf', '1ht', '2ht', 'bow', 'xbw', 'ht1']
    dmgThrowBase,
    dmgBase,
    dmgTwoHandedBase,
    dmgThrowModified: calculateItemDmg(dmgThrowBase, item),
    dmgModified: calculateItemDmg(dmgBase, item),
    dmgTwoHeadedModified: calculateItemDmg(dmgTwoHandedBase, item),
    ...getAttackSpeed(itemDetails.speed || 0, item, itemDetails),
    requiredStrength: calculateRequirement(itemDetails.reqstr || 0, item),
    requiredDexterity: calculateRequirement(itemDetails.reqdex || 0, item),
    requiredLevel: item.lvlreq || 0
  };
}

function calculateItemArmor({ min, max }, item) {
  const props = getItemProps(item);
  const result = {
    min,
    max
  };

  const ac = props.find(({ key }) => key === 'ac%');
  if (ac) {
    result.min = Math.floor(result.min * (1 + (ac.min) / 100));
    result.max = Math.floor(result.max * (1 + (ac.max) / 100));
  }

  const acLvl = props.find(({ key }) => key === 'ac/lvl');
  if (acLvl) {
    result.max = result.max + Math.floor(CHARACTER_LEVEL * 2);
  }

  return result;
}

function calculateRequirement(defaultValue, item) {
  const props = getItemProps(item);
  let result = defaultValue;

  const ease = props.find(({ key }) => key === 'ease');
  if (ease) {
    result = Math.ceil(result * (1 + ease.min / 100));
  }

  return result;
}

function getArmorStats(itemDetails, item) {
  let armorBase = {
    min: itemDetails.minac,
    max: itemDetails.maxac
  };

  if (Object.values(item).includes('ac%')) {
    armorBase = {
      min: itemDetails.minac + 1,
      max: itemDetails.maxac + 1
    };
  }

  return {
    armorClass: itemDetails.type || 'unknown', // ['pelt', 'phlm', 'head', 'ashd', 'amaz', 'rod']
    armorBase,
    armorModified: calculateItemArmor(armorBase, item),
    requiredStrength: calculateRequirement(itemDetails.reqstr || 0, item),
    requiredDexterity: calculateRequirement(itemDetails.reqdex || 0, item),
    requiredLevel: item.lvlreq || 0
  };
}

function getOtherStats(itemDetails, item) {
  return {};
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

function getItemBaseData(item) {
  const weapons = data.weapons;
  const armors = data.armor;
  const misc = data.misc;

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

const CLASS_WHITE = 'white';
const CLASS_MAGIC = 'magic';
const CLASS_UNIQUE = 'unique';
const CLASS_SET = 'set';
const CLASS_REQUIREMENT = 'requirement';

const ITEMS_NOT_ETHEREAL = [
  'bow'
];

const ITEMS_WITHOUT_DURABILITY = [
  'bow'
];

function getCanBePerfect(item) {
  return item.props.every((prop) => prop.fixedValues);
}

function getCanBeEthereal(item) {
  const weaponClass = item.stats.weaponClass;

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

  const weaponClass = item.stats.weaponClass;

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
    return restriction.items.includes(item.type.key);
  });

  return result ? result.class : false;
}

function itemToParsedArray(item) {
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
  en.push(`<span class='${isSet ? CLASS_SET : CLASS_UNIQUE}'>${item.type.en}</span>`);

  if (isWeapon) {
    // Damage
    if (item.stats.dmgThrowBase.min) {
      en.push(`<span class='${CLASS_WHITE}'>Throw Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.stats.dmgThrowModified.min)} to ${getFlatPropertyValue(item.stats.dmgThrowModified.max)}</span>`);
    }

    if (item.stats.dmgBase.min) {
      en.push(`<span class='${CLASS_WHITE}'>One-Hand Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.stats.dmgModified.min)} to ${getFlatPropertyValue(item.stats.dmgModified.max)}</span>`);
    }

    if (item.stats.dmgTwoHandedBase.min) {
      en.push(`<span class='${CLASS_WHITE}'>Two-Hand Damage:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.stats.dmgTwoHeadedModified.min)} to ${getFlatPropertyValue(item.stats.dmgTwoHeadedModified.max)}</span>`);
    }
  }

  if (isArmor) {
    if (item.stats.armorModified) {
      en.push(`<span class='${CLASS_WHITE}'>Defense:</span> <span class='${CLASS_MAGIC}'>${getFlatPropertyValue(item.stats.armorModified.min)} to ${getFlatPropertyValue(item.stats.armorModified.max)}</span>`);
    }
  }

  if (durability) {
    en.push(`<span class='${CLASS_WHITE}'>Durability: ${item.durability} of ${item.durability}</span>`);
  }

  if (classRestriction) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>[${classRestriction} Only]</span>`);
  }

  if (item.stats.requiredDexterity) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>Required Dexterity: ${item.stats.requiredDexterity}</span>`);
  }

  if (item.stats.requiredStrength) {
    en.push(`<span class='${CLASS_REQUIREMENT}'>Required Strength: ${item.stats.requiredStrength}</span>`);
  }

  if (item.stats.requiredLevel) {
    en.push(`<span class='${CLASS_WHITE}'>Required Level: ${item.stats.requiredLevel}</span>`);
  }

  if (isWeapon) {
    en.push(`<span class='${CLASS_WHITE}'>${item.typeClass.en} -</span> <span class='${item.stats.attackSpeed.modified ? CLASS_MAGIC : CLASS_WHITE}'>${item.stats.attackSpeed.en}</span>`);
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
    // item, // for development
    en,
    pl: en
  };
}

function convert() {
  loadStrings();
  loadData();
  loadItemNames();

  const items = { ...data.uniqueItems, ...data.setItems };
  const res = Object.keys(items)
    // .filter((item) => { // TODO jfr
    //   return [
    //     'Boneslayer Blade',
    //     'Irices Shard'
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

      return itemToParsedArray({
        key,
        name: {
          key: item.index,
          ...itemNames[item.index]
        },
        ...getItemBaseData(item),
        props: getItemProps(item)
      });
    });

  fs.writeFileSync('../src/items/items.json', JSON.stringify(res));
  console.log(`Success. Converted ${res.length} items`);
}

function getCharAllSkillString(index) {
  const charStats = data.charStats;

  const res = Object.values(charStats).reduce((acc, val) => {
    return [
      ...acc,
      val.strallskills
    ];
  }, []);

  return findString(res[index]);
}

function getCharTreeString(index) {
  const charStats = data.charStats;

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

convert();
