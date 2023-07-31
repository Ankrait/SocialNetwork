export const deepEqual = (a: Object, b: Object): boolean => {
  if (
    a === null ||
    b === null ||
    a !instanceof Object ||
    b !instanceof Object
  ) {
    return a === b;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((key) => bKeys.includes(key) && deepEqual(a[key], b[key]));
};
