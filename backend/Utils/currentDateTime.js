exports.currentDateTime = () => {
  let today = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + today.getDate()).slice(-2).toString();
  // current month
  let month = ("0" + (today.getMonth() + 1)).slice(-2).toString();
  // current year
  let year = today.getFullYear().toString();
  // current hour
  let hour = ("0" + today.getHours()).slice(-2).toString();
  // cuurent minute
  let minute = ("0" + today.getMinutes()).slice(-2).toString();
  // cuurent second
  let second = ("0" + today.getSeconds()).slice(-2).toString();

  let datetime = year + month + date + hour + minute + second;

  return Number(datetime);
};

exports.datetimeAfterOneHour = (dateTime) => {
  const strDateTime = dateTime.toString();
  let strYear = strDateTime.slice(0, 4);
  let strMonth = strDateTime.slice(4, 6);
  let strDate = strDateTime.slice(6, 8);
  let strHour = strDateTime.slice(8, 10);
  let strMinute = strDateTime.slice(10, 12);
  let strSecond = strDateTime.slice(12, 14);

  let strDateObject =
    strYear +
    "-" +
    strMonth +
    "-" +
    strDate +
    " " +
    strHour +
    ":" +
    strMinute +
    ":" +
    strSecond;

  let dateObject = new Date(strDateObject);
  let thirtyMinutes = 60 * 60 * 1000; // convert 30 minutes to milliseconds
  let dateTimeAfterOneHour = new Date(dateObject.getTime() + thirtyMinutes);

  let date = ("0" + dateTimeAfterOneHour.getDate()).slice(-2).toString();
  // current month
  let month = ("0" + (dateTimeAfterOneHour.getMonth() + 1))
    .slice(-2)
    .toString();
  // current year
  let year = dateTimeAfterOneHour.getFullYear().toString();
  // current hour
  let hour = ("0" + dateTimeAfterOneHour.getHours()).slice(-2).toString();
  // cuurent minute
  let minute = ("0" + dateTimeAfterOneHour.getMinutes()).slice(-2).toString();
  // cuurent second
  let second = ("0" + dateTimeAfterOneHour.getSeconds()).slice(-2).toString();

  let datetime = year + month + date + hour + minute + second;

  return datetime;
};

exports.todayDay = () => {
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[d.getDay()];
};

exports.currentTimestamp = () => {
  return (currentTimestamp = new Date());
};

exports.convertMillisecondToMinute = (ms) => {
  return Math.ceil(ms / 60000);
};

exports.getHourFromDatetime = (datetime) => {
  let strDatetime = datetime.toString();
  let strHour = strDatetime.slice(8, 10);
  let hour = Number(strHour);
  return hour;
};

exports.getHourFromDatetimeAnalysis = (datetime) => {
  console.log("datetime", datetime);
  let strHour = datetime.slice(8, 10);
  // let hour = Number(strHour);
  return strHour;
};

exports.getDateFromDatetime = (datetime) => {
  let strDatetime = datetime.toString();
  let strYear = strDatetime.slice(0, 4);
  let strMonth = strDatetime.slice(4, 6);
  let strDate = strDatetime.slice(6, 8);
  const finalDate = strDate + "-" + strMonth + "-" + strYear;
  return finalDate;
};
