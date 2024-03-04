export const handleAge = (minAge, maxAge, t) => {
    if (minAge && maxAge) {
      return `${minAge} ${t("until")} ${maxAge} ${t("year")}`;
    } else if (minAge && !maxAge) {
      return `${t("from")} ${minAge} ${t("year")}`;
    } else if (!minAge && maxAge) {
      return `${t("until")} ${maxAge} ${t("year")}`;
    } else {
      return "";
    }
  };