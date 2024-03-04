export const getSvgPath = (status) => {
  const lookup = {
    ACTIVE: "/assets/svg/active.svg",
    PAUSEDBYUSER: "/assets/svg/paused.svg",
    ARCHIVED: "/assets/svg/archived.svg",
  };
  const result = lookup[status];
  return result;
};
