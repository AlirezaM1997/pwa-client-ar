export const saveToStorage = (key, value) => {
  if (typeof window !== "undefined") {
    return window.localStorage.setItem(key, value);
  }
};
