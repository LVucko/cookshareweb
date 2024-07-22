export const isoDateToLocale = (isoDate) => {
  var isodate = new Date(isoDate);
  return isodate.toLocaleDateString("hr-HR");
};
