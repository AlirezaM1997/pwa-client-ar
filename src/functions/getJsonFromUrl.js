export function getJsonFromUrl(url, inMiddleware=false) {
  if (!url && !inMiddleware) url = window.location.search;
  let query = url.substr(1);
  if (!query) return null;
  let result = {};
  query.split("&").forEach(function (part) {
    let item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
