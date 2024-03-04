export const getStatusName = (status, lang) => {
  const lookup = {
    ACTIVE: lang == "ar" ? "المنشور" : "Active",
    PAUSEDBYUSER: lang == "ar" ? "تم نشره" : "Paused",
    ARCHIVED: lang == "ar" ? "الإنهاء" : "Archived",
  };
  return lookup[status];
};
