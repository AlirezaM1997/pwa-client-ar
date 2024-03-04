export const getPercentage = (value, total) => {
    if (value === 0) {
      return 0;
    } else {
      let res = ((value / total) * 100).toFixed(2);
      return res;
    }
  };