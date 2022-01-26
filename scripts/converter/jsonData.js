'use strict';

const fs = require('fs');
const path = require("path");

let _data = null;
let _strings = null;
let _itemNames = null;

function d2Data() {
  if (_data === null) {
    _data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'));
  }

  return _data;
}

function strings() {
  if (_strings === null) {
    _strings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/strings_en.json'), 'utf8'));
  }

  return _strings;
}

function itemNames() {
  if (_itemNames === null) {
    _itemNames = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/itemNames.json'), 'utf8'));
  }

  return _itemNames;
}

module.exports = { strings, d2Data, itemNames };