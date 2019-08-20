export const dateInThePast = (date: Date): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};
