export const getDate = (date, lang, hasTime = false) => {
  const d = new Date(date);
  let month = "";
  let year = "";
  let day = "";
  let time = "";

  if (lang == "ar") {
    month = new Intl.DateTimeFormat("ar-FR-u-ca-islamic", {
      month: "short",
    }).format(d);
    year = new Intl.DateTimeFormat("ar-FR-u-ca-islamic", {
      year: "numeric",
    }).format(d);
    day = new Intl.DateTimeFormat("ar-FR-u-ca-islamic", {
      day: "numeric",
    }).format(d);
    time = new Intl.DateTimeFormat("ar-FR-u-ca-islamic", {
      timeStyle: "short",
      hourCycle: "h24",
    }).format(d);
  } else {
    month = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(d);
    year = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(d);
    day = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
    }).format(d);
    time = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      hourCycle: "h24",
    }).format(d);
  }
  if (hasTime) {
    return `${day} ${month} ${year} - ${time}`;
  } else {
    return `${day} ${month} ${year}`;
  }
};
