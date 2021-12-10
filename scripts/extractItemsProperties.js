const fs = require('fs');

let strings = null;
let data = null;
let itemNames = null;

const ITEM_TYPES_ENUM = {
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  OTHER: 'Other'
};

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

function getSkillName(id) {
  const skillData = data.skills[id];
  if (!skillData) {
    return 'to UNKNOWN';
  }

  return `to ${skillData.skill} (${skillData.charclass})`;
}

function executePropFunction(set, val, func, stat, skillId) {
  let itemStatCost = data.itemStatCost[stat];
  let translation = '';

  switch (func) {
    // case 3:
    //   m(stat, null, resultMaybe);
    //   break;
    case 5:
      itemStatCost = data.itemStatCost['mindamage'];
      translation = findString(itemStatCost.descstrpos);
      break;
    case 6:
      itemStatCost = data.itemStatCost['maxdamage'];
      translation = findString(itemStatCost.descstrpos);
      break;
    case 7:
      itemStatCost = data.itemStatCost['damagepercent'];
      translation = findString('strModEnhancedDamage');
      break;
    // case 10:
    //   translation = getSkillName(skillId); // TODO char skill tree
    //   break;
    // case 11:
    //   if (0 === r) {
    //     var v = p.a.skills[n].reqlevel;
    //     r = Math.round((l - v + 1) / 3.9), m(stat, ''.concat(n, '#').concat(a, '#x'), r);
    //   } else m(stat, ''.concat(n, '#').concat(a), r);
    //   break;
    case 12:
      translation = getSkillName(skillId);
      break;
    case 14:
      translation = findString('Socketable');
      break;
    // case 15:
    //   m(stat, null, a);
    //   break;
    // case 16:
    //   m(stat, null, r);
    //   break;
    // case 17:
    //   m(stat, null, null != n ? n : i);
    //   break;
    // case 19:
    //   if (a < 0 && r < 0 && p.a.skills[n]) {
    //     var b = p.a.skills[n].reqlevel,
    //       g = Math.max(1, Math.floor((l - b) / Math.floor((99 - b) / -r))),
    //       y = Math.floor(-a * g / 8) + -a;
    //     m(stat, ''.concat(n, '#').concat(g), y);
    //   } else m(stat, ''.concat(n, '#').concat(r), a);
    //   break;
    case 20:
      itemStatCost = data.itemStatCost['item_indesctructible'];
      translation = findString(itemStatCost.descstrpos);
      break;
    // case 21:
    //   m(stat, val, i);
    //   break;
    case 22:
    case 24:
      translation = getSkillName(skillId);
      break;
    case 23:
      translation = 'Ethereal (Cannot be Repaired)';
      break;
    // case 36:
    //   m(stat, ''.concat(val, '#x'), i);
    //   break;
    default:
      if ([
        'poisonlength',
        'coldlength',
        'item_extrablood',
        'item_fastergethitrate',
        'maxdurability'
      ].includes(stat)) {
        // fallback for some functions
        translation = stat;
      } else {
        translation = findString(itemStatCost.descstrpos);
      }
  }
  return {
    priority: (itemStatCost ? itemStatCost.descpriority || 0 : 0) + .001 * (itemStatCost ? itemStatCost.id || 999 : 999),
    name: {
      en: translation,
      pl: translation
    }
  };
}

function getPropData(propKey, skillId) {
  const parsedPropKey = propKey.replace('*', '');
  const property = Object.entries(data.properties).find(([key]) => {
    return key === parsedPropKey;
  });

  if (!property) {
    console.warn(`Translation properties not found for ${propKey}`);
    return {
      en: propKey,
      pl: propKey
    };
  }

  // TODO functions can be 7 and modify dmg, required level, attack speed etc
  const result = executePropFunction(property[1].set1, property[1].val1, property[1].func1, property[1].stat1, skillId);

  return result;
}

function getItemProps(item) {
  return Object.entries(item)
    .filter(([key]) => {
      return key.startsWith('prop');
    })
    .map(([key, value]) => {
      const propNumber = parseInt(key.slice(4), 10);
      const skillId = item[`par${propNumber}`];

      return {
        key: value,
        ...getPropData(value, skillId),
        min: item[`min${propNumber}`],
        max: item[`max${propNumber}`]
      };
    }).sort((a, b) => b.priority - a.priority);
}

function calculateItemDmg({ min, max }, item) {
  const props = getItemProps(item);
  const result = {
    min: [min, min],
    max: [max, max]
  };

  // TODO replace with func7
  const dmgPercent = props.find(({ key }) => key === 'dmg%');
  if (dmgPercent) {
    result.min[0] = Math.floor(result.min[0] * (1 + dmgPercent.min / 100));
    result.min[1] = Math.floor(result.min[1] * (1 + dmgPercent.max / 100));
    result.max[0] = Math.floor(result.max[0] * (1 + dmgPercent.min / 100));
    result.max[1] = Math.floor(result.max[1] * (1 + dmgPercent.max / 100));
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
    result.min[1] = result.min[1] + dmgMin.min;
  }

  const dmgMax = props.find(({ key }) => key === 'dmg-max');
  if (dmgMax) {
    result.min[0] = result.min[0] + dmgMax.min;
    result.min[1] = result.min[1] + dmgMax.min;
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

function getWeaponStats(itemDetails, item) {
  // console.log({itemDetails, item})
  // console.log(itemDetails['2handmindam'])
  const twoHanded = itemDetails['2handed'] === 1;
  const dmgBase = {
    min: itemDetails.mindam,
    max: itemDetails.maxdam
  }
  const dmgTwoHandedBase = {
    min: itemDetails['2handmindam'],
    max: itemDetails['2handmaxdam']
  }

  return {
    twoHanded,
    weaponClass: itemDetails.wclass || 'unknown', // ['1hs', 'stf', '1ht', '2ht', 'bow', 'xbw', 'ht1']
    dmgBase,
    dmgTwoHandedBase,
    dmgModified: calculateItemDmg(dmgBase, item), // TODO value can be mutated by props
    dmgTwoHeadedModified: calculateItemDmg(dmgTwoHandedBase, item), // TODO value can be mutated by props
    attackSpeed: itemDetails.speed || 0, // TODO value can be mutated by props
    requiredStrength: itemDetails.reqstr,
    requiredDexterity: itemDetails.reqdex,
  };
}

function getArmorStats(itemDetails, item) {
  return {};
}

function getOtherStats(itemDetails, item) {
  return {};
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
    ...(itemType === ITEM_TYPES_ENUM.WEAPON && { stats: getWeaponStats(itemDetails, item) }),
    ...(itemType === ITEM_TYPES_ENUM.ARMOR && { stats: getArmorStats(itemDetails, item) }),
    ...(itemType === ITEM_TYPES_ENUM.OTHER && { stats: getOtherStats(itemDetails, item) }),
    requiredLevel: item.lvlreq || 0, // TODO value can be mutated by props
    durability: itemDetails.durability || null,
    set: item.set || null,
    isSet: !!item.set,
    tier,
    tierName: ['None', 'Normal', 'Exceptional', 'Elite'][tier],
    rarity: itemDetails.rarity || 0
  };
}

function convert() {
  loadStrings();
  loadData();
  loadItemNames();

  const items = { ...data.uniqueItems, ...data.setItems };
  const res = Object.keys(items)
    // .filter((item) => {
    //   return [
    //     'Lycander\'s Aim'
    //   ].includes(items[item].index)
    // })
    .map((key) => {
      const item = items[key];

      // TODO base defense for armor pieces

      return {
        key,
        name: {
          key: item.index,
          ...itemNames[item.index]
        },
        canBePerfect: false, // TODO
        canBeEthereal: 1, // TODO
        ...getItemBaseData(item),
        props: getItemProps(item)
      };
    });

  fs.writeFileSync('../src/items/items.json', JSON.stringify(res));
  console.log(`Success. Converted ${res.length} items`);
}

convert();
