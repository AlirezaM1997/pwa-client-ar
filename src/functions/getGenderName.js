export const getGenderName = (gender, lang) => {
    const lookup = {
      all: lang == "ar"  ? "الكل" : "all",
      Male: lang == "ar"  ? "الرجل" : "Male",
      Female: lang == "ar"  ? "المرأة" : "Female",
    };
    const result = lookup[gender];
    return result;
  };