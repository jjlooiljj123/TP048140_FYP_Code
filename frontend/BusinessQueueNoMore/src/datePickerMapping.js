export const datePickerToBackendFormatMapping = (date) => {
  let finalDate = '';
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);
  finalDate = year + month + day + '000000';
  let numDate = Number(finalDate);
  return numDate;
};

export const addOneDayFromPicker = (date) => {
  let finalDate = '';
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);
  finalDate = year + month + day + '235900';
  let numDate = Number(finalDate);
  return numDate;
};
