export const removeQueryParam = () => {
  const url = window.location.href;
  let r = new URL(url);
  r.search = "";
  const newUrl = r.href;
  window.history.replaceState({ path: newUrl }, "", newUrl);
};