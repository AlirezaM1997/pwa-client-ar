import { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic"
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

export function convertArabicToGregorian(date, time, isMaxDate = false) {
  const convertedDate = new DateObject({
    calendar: arabic,
    locale: gregorian_en,
    date: date + " " + time,
  });

  return isMaxDate
    ? convertedDate.add(1, "days").convert(gregorian, gregorian_en).toDate().toISOString()
    : convertedDate.convert(gregorian, gregorian_en).toDate().toISOString();
}
