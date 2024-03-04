export const getRequirementsName = (status, lang) => {
    const _status = String(status).toUpperCase();
    const lookup = {
      MORAL:  lang == "ar" ? "المعنوية" : "Moral",
      FINANCIAL:  lang == "ar" ? "المالية" : "Financial",
      IDEAS:  lang == "ar" ? "الفكرة" : "Idea",
      CAPACITY:  lang == "ar" ? "المساعدات" : "Valency",
      PRESSENCE:  lang == "ar" ? "الحضورية" : "In Person",
      PRESENCE:  lang == "ar" ? "الحضورية" : "In Person",
      SKILL:  lang == "ar" ? "التخصصات" : "Professional",
    };
    const result = lookup[_status];
    return result;
  };