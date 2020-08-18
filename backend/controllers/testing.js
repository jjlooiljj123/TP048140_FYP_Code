// exports.testingDate = (req, res, next) => {
//   let today = new Date();
//   // current date
//   // adjust 0 before single digit date
//   let date = ("0" + today.getDate()).slice(-2).toString();
//   // current month
//   let month = ("0" + (today.getMonth() + 1)).slice(-2).toString();
//   // current year
//   let year = today.getFullYear().toString();
//   // current hour
//   let hour = ("0" + today.getHours()).slice(-2).toString();
//   // cuurent minute
//   let minute = ("0" + today.getMinutes()).slice(-2).toString();
//   // cuurent second
//   let second = ("0" + today.getSeconds()).slice(-2).toString();

//   var time =
//     today.getHours().toString() +
//     today.getMinutes().toString() +
//     today.getSeconds().toString();

//   let datetime = year + month + date + hour + minute + second;
//   const number = Number(datetime);
//   res.status(200).json({
//     datetime: number,
//   });
// };

// exports.testingDate = (req, res, next) => {
//   // let today = new Date();
//   // const now = new Date(today.getTime() + 30 * 60000);

//   // let difference = now.getTime() - today.getTime();
//   let dateTime = 20200716130211;
//   const strDateTime = dateTime.toString();
//   let strYear = strDateTime.slice(0, 4);
//   let strMonth = strDateTime.slice(4, 6);
//   let strDate = strDateTime.slice(6, 8);
//   let strHour = strDateTime.slice(8, 10);
//   let strMinute = strDateTime.slice(10, 12);
//   let strSecond = strDateTime.slice(12, 14);

//   let strDateObject =
//     strYear +
//     "-" +
//     strMonth +
//     "-" +
//     strDate +
//     " " +
//     strHour +
//     ":" +
//     strMinute +
//     ":" +
//     strSecond;

//   let dateObject = new Date(strDateObject);
//   let thirtyMinutes = 30 * 60 * 1000; // convert 30 minutes to milliseconds
//   let dateTimeAfter30Minutes = new Date(dateObject.getTime() + thirtyMinutes);

//   let date = ("0" + dateTimeAfter30Minutes.getDate()).slice(-2).toString();
//   // current month
//   let month = ("0" + (dateTimeAfter30Minutes.getMonth() + 1))
//     .slice(-2)
//     .toString();
//   // current year
//   let year = dateTimeAfter30Minutes.getFullYear().toString();
//   // current hour
//   let hour = ("0" + dateTimeAfter30Minutes.getHours()).slice(-2).toString();
//   // cuurent minute
//   let minute = ("0" + dateTimeAfter30Minutes.getMinutes()).slice(-2).toString();
//   // cuurent second
//   let second = ("0" + dateTimeAfter30Minutes.getSeconds()).slice(-2).toString();

//   let datetime = year + month + date + hour + minute + second;

//   res.status(200).json({
//     hour: dateObject,
//     dateTimeAfter30Minutes: dateTimeAfter30Minutes,
//     datetime: datetime,
//     time: aaa,
//   });
// };

// const ShopStatus = require("../models/ShopStatus");
// const Shop = require("../models/Shop");
// const Queue = require("../models/Queue");

// exports.testingDate = async (req, res, next) => {
//   const shopId = "5f0ee65eae95f2281cc8e21f";
//   const shopStatus = await ShopStatus.findById(shopId);
//   const shop = await Shop.findById(shopId);
//   const numberOfStegeOneQueues = await Queue.find({
//     queue_shop: shopId,
//     queue_stage: 1,
//     queue_queueStatus: 1,
//   }).countDocuments();
//   const stegeOneQueues = await Queue.find({
//     queue_shop: shopStatus,
//     queue_stage: 1,
//     queue_queueStatus: 1,
//   });
//   console.log("numberOfStegeOneQueues Array:", stegeOneQueues);
//   stageOneQueueLength = numberOfStegeOneQueues;
//   console.log("stageOneQueueLength:", stageOneQueueLength);
//   res.status(200).json({
//     message: "ok",
//   });
// };

const { getNumberOfServersOfStageOne } = require("./serverPerformance");
exports.testingDate = async (req, res, next) => {
  const shopId = "5f0ee65eae95f2281cc8e21f";
  const reult = await getNumberOfServersOfStageOne(shopId);
  res.status(200).json({
    message: "ok",
    reult: reult,
  });
};
