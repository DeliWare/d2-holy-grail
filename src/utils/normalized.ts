// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
const normalized = (string: string) =>
  string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0142/g, 'l');

export default normalized;
