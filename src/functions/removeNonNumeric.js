export const removeNonNumeric = (num) =>
  num
    .toString()
    .replace(/[^۰۱۲۳۴۵۶۷۸۹0-9]/g, "")
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
