export const getParticipationStatusName = (status, lang) => {
  const lookup = {
    APPROVED: lang == "ar" ? "تم تأييده" : "Approved",
    PENDING: lang == "ar" ? "قيد التحقيق" : "Pending",
    REJECTED: lang == "ar" ? "تم رفضه" : "Rejected",
  };
  return lookup[status];
};

export const FilterPaticipationStatusEnum = ["APPROVED", "REJECTED", "PENDING"];
