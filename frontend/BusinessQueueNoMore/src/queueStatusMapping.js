export const queueStatusMapping = (queueStatus) => {
  let strStatus = '';
  if (queueStatus == 1) {
    strStatus = 'Queuing';
  } else if (queueStatus == 2) {
    strStatus = 'Serving';
  } else if (queueStatus == 3) {
    strStatus = 'Completed';
  } else if (queueStatus == 4) {
    strStatus = 'Skipped';
  } else if (queueStatus == 5) {
    strStatus = 'Canceled';
  }
  return strStatus;
};
