export const handleMainPicture = (index, arrayLength=0) => {
  if (arrayLength === 0) {
    if (index === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
