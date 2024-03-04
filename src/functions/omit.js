export function omit(obj, propToOmit) {
  const newObj = { ...obj };

  if (Array.isArray(propToOmit)) {
    propToOmit.forEach((prop) => delete newObj[prop]);
  } else {
    delete newObj[propToOmit];
  }

  return newObj;
}
