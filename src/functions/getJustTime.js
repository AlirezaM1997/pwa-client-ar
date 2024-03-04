import { toEnglishDigits } from "@functions/toEnglishDigits"
export const getJustTime = (date, lang = "en") => {
  const d = new Date(date)
  let time = ""

  if (lang == "ar") {
    time = new Intl.DateTimeFormat("ar-FR-u-ca-islamic", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  } else {
    time = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  }

  return toEnglishDigits(time)
}
