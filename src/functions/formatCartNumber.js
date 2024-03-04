export function formatCartNumber(text) {
  if (!text) return "";

  const cartNumber = text.replace(/(\d{4})(?=\d{4})/g, "$1-").slice(0, 25);

  return cartNumber;
}
