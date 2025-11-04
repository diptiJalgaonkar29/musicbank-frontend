export const formatDuration = (durationInSec) => {
  if (!durationInSec || durationInSec <= 0) return "00:00:00";
  var date = new Date(0);
  date.setSeconds(durationInSec);
  var timeString = date.toISOString().substring(11, 19);
  return timeString;
};
