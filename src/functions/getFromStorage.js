export const getFromStorage = (key) => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
  };