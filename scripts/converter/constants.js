'use strict';

const ITEM_TYPES_ENUM = {
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  OTHER: 'Other'
};

const CHARACTERS = {
  ama: 'Amazon',
  sor: 'Sorceress',
  nec: 'Necromancer',
  pal: 'Paladin',
  bar: 'Barbarian',
  dru: 'Druid',
  ass: 'Assassin'
};

const CHARACTER_CLASSES_SHORT = ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass'];

const WEAPON_ATTACK_SPEED = {
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

const CHARACTER_LEVEL = 99;
const FRAME_LENGTH = 25;

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

module.exports = {
  ITEM_TYPES_ENUM,
  CHARACTERS,
  CHARACTER_LEVEL,
  FRAME_LENGTH,
  CLASS_WHITE,
  CLASS_MAGIC,
  CLASS_UNIQUE,
  CLASS_SET,
  CLASS_REQUIREMENT,
  ITEMS_NOT_ETHEREAL,
  ITEMS_WITHOUT_DURABILITY,
  WEAPON_ATTACK_SPEED,
  CHARACTER_CLASSES_SHORT
};