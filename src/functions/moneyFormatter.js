export const moneyFormatter = (n) => {
    return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };