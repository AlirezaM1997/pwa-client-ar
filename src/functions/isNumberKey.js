export function isNumberKey(event) {
  if (!(Number(event.key) >= 0 && Number(event.key) <= 9) && event.key != "Backspace")
    // Checks whether the key is different from the number or backspace
    event.preventDefault();
}
