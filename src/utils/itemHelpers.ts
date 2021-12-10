export const getPropertyRangeOrValue = (values: number[] | undefined): string => {
  if (!values || !Array.isArray(values) || values.length === 0) {
    return '';
  }

  const isSame = values[0] === values[1];

  return isSame ? `${values[0]}` : `${values[0]}-${values[1]}`;
};
