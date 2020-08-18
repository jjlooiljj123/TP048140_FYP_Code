const { validationResult } = require("express-validator");

const ShopStatus = require("../models/ShopStatus");
const User = require("../models/User");
const ShopActivity = require("../models/ShopActivity");
const Queue = require("../models/Queue");

const shopActivityController = require("./ShopActivity");
const {
  estimatedTimeBasedOnActivity,
  stageOneLength,
  stageOneEstimatedTime,
} = require("./queueLengthAndTimeCalculation");

const {
  createServerPerformance,
  updateServerPerformanceEndtime,
  getNumberOfActiveServerOfActivity,
} = require("../controllers/serverPerformance");
const combinedPerformanceController = require("../controllers/combinedPerformance");
const { todayDay, currentDateTime } = require("../Utils/currentDateTime");

// create shhop status, will be called in shopController
// called in shop controller - createShop
exports.createShopStatus = async (
  shopId,
  shop,
  owner,
  shopName,
  branch,
  logoUrl,
  directory
) => {
  const shopStatus = new ShopStatus({
    _id: shopId,
    shopStatus_shop: shop,
    shopStatus_owner: owner,
    shopStatus_shopName: shopName,
    shopStatus_branch: branch,
    shopStatus_logoUrl: logoUrl,
    shopStatus_directory: directory,
  });
  try {
    await shopStatus.save(); // create a document in the shops status collection
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    next(err);
  }
};

// not yet comepleted (sorting?:according to distance)
// planned to be used for customer, showing a list of shops
// http://localhost:8080/shop?page=3
exports.getShopStatuses = async (req, res, next) => {
  //pagination
  const currentPage = req.query.page || 1;
  const shopPerPage = 999;
  try {
    const totalShopStatuses = await ShopStatus.find().countDocuments();
    const shopStatus = await ShopStatus.find()
      .skip((currentPage - 1) * shopPerPage)
      .limit(shopPerPage);

    res.status(200).json({
      message: "Fetch Shop successfully",
      shopStatus: shopStatus,
      totalShopStatuses: totalShopStatuses,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// filtering fucntion, based on directory and queue length
// http://localhost:8080/shopStatus/?directory=directory&queueLentgth=queueLength&page=page
exports.filterShopStatus = async (req, res, next) => {
  const directory = req.query.directory || null;
  const queueLentgth = req.query.queueLentgth || 9999999;
  //pagination
  const currentPage = req.query.page || 1;
  const shopPerPage = 999;
  let totalShopStatuses;
  let shopStatus;
  let queueLengthStageOne = [];
  let estimatedTimeStageOne = [];
  let shopStatuses = [];
  try {
    // if (directory == null) {
    //   totalShopStatuses = await ShopStatus.find({
    //     shopStatus_stageOneQueueLength: { $lt: queueLentgth },
    //   }).countDocuments();
    //   shopStatus = await ShopStatus.find({
    //     shopStatus_stageOneQueueLength: { $lt: queueLentgth },
    //   })
    //     .skip((currentPage - 1) * shopPerPage)
    //     .limit(shopPerPage);
    // } else {
    //   totalShopStatuses = await ShopStatus.find({
    //     shopStatus_directory: directory,
    //     shopStatus_stageOneQueueLength: { $lt: queueLentgth },
    //   }).countDocuments();
    //   shopStatus = await ShopStatus.find({
    //     shopStatus_directory: directory,
    //     shopStatus_stageOneQueueLength: { $lt: queueLentgth },
    //   })
    //     .skip((currentPage - 1) * shopPerPage)
    //     .limit(shopPerPage);
    // }
    if (directory == null) {
      totalShopStatuses = await ShopStatus.find({
        shopStatus_stageOneWaitingTime: { $lt: queueLentgth },
      }).countDocuments();
      shopStatus = await ShopStatus.find({
        shopStatus_stageOneWaitingTime: { $lt: queueLentgth },
      })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);
    } else {
      totalShopStatuses = await ShopStatus.find({
        shopStatus_directory: directory,
        shopStatus_stageOneWaitingTime: { $lt: queueLentgth },
      }).countDocuments();
      shopStatus = await ShopStatus.find({
        shopStatus_directory: directory,
        shopStatus_stageOneWaitingTime: { $lt: queueLentgth },
      })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);
    }
    //----------------------------------------------
    //
    for (let i = 0; i < totalShopStatuses; i++) {
      let estimatedTimeByShop = await stageOneEstimatedTime(
        shopStatus[i]._id,
        todayDay(),
        currentDateTime()
      );
      shopStatus[i].shopStatus_stageOneWaitingTime = estimatedTimeByShop;
      await shopStatus[i].save();

      // estimatedTimeStageOne.push(estimatedTimeByShop);
    }

    res.status(200).json({
      message: "Fetch Shop successfully",
      shopStatus: shopStatus,
      totalShopStatuses: totalShopStatuses,
      // estimatedTimeStageOne: estimatedTimeStageOne,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get a specific shop status
// http://localhost:8080/shopStatus/:shopStatusId/?stage=stage
exports.getShopStatus = async (req, res, next) => {
  const shopStatusId = req.params.shopStatusId;
  const stage = req.query.stage || 1;
  const shopStatus = await ShopStatus.findById(shopStatusId);
  let estimatedTimeByActivity;
  let estimatedTimeByActivityArray = [];
  try {
    if (!shopStatus) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }
    // get shop activities according to stage (by deault is stage 1, used in queue selection)
    const shopActivities = await shopActivityController.getShopActivityByStage(
      shopStatusId,
      stage
    );
    // //get the estimated waiting time for each and every activity
    // for (let i = 0; i < shopActivities.length; i++) {
    //   estimatedTimeByActivity = await estimatedTimeBasedOnActivity(
    //     shopActivities[i]._id,
    //     todayDay(),
    //     currentDateTime()
    //   );

    //   // if there is no record for the estimated time, it will return -1, hence become negative
    //   if (estimatedTimeByActivity < 0) {
    //     estimatedTimeByActivity = "N/A";
    //   }
    //   // estimated time is sent back to front end by an array
    //   // estimatedTimeByActivityArray.push(estimatedTimeByActivity);
    //   shopStatus.shopStatus_stageOneWaitingTime = estimatedTimeByActivity;
    // }
    //get the estimated waiting time for each and every activity
    let estimatedTime = await stageOneEstimatedTime(
      shopStatusId,
      todayDay(),
      currentDateTime()
    );
    shopStatus.shopStatus_stageOneWaitingTime = estimatedTime;
    res.status(200).json({
      message: "Shop fetched",
      shopStatus: shopStatus,
      shopActivities: shopActivities,
      // estimatedTimeByActivityArray: estimatedTimeByActivityArray,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// update the shopstaus infor
// will only be called in shopController
exports.updateShopStatus = async (
  shopId,
  shop,
  shopName,
  branch,
  logoUrl,
  directory
) => {
  const shopStatus = await ShopStatus.findById(shopId);
  try {
    if (!shopStatus) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }
    shopStatus.shopStatus_shop = shop;
    shopStatus.shopStatus_shopName = shopName;
    shopStatus.shopStatus_branch = branch;
    shopStatus.shopStatus_logoUrl = logoUrl;
    shopStatus.shopStatus_directory = directory;
    await shopStatus.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// delete shop status, will only be called in shopController
// http://localhost:8080/shopStatus/shopAvailability/:shopStatusId
exports.deleteShopStatus = async (shopId) => {
  await ShopStatus.findByIdAndRemove(shopId);
};

// edit shop open/clsoe and accept queue, reservation
// http://localhost:8080/shopStatus/shopAvailability/:shopStatusId
exports.shopOpenCloseAcceptQueueReservation = async (req, res, next) => {
  const shopId = req.params.shopId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return next(error); // go to the error handling meiddleware
  }
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    //check if see whether shop exist
    if (!shopStatus) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }
    //check if see whether the editor has the autority to edit
    if (shopStatus.shopStatus_owner.toString() != req.userId) {
      const error = new Error("Not Authorized!");
      error.statusCode = 404;
      return next(error);
    }
    shopStatus.shopStatus_shopOpenClose = req.body.shopOpenClose;
    shopStatus.shopStatus_shopAcceptQueue = req.body.shopAcceptQueue;
    shopStatus.shopStatus_reservationAvailability =
      req.body.reservationAvailability;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// staff start or stop serving for an activity
// action = add / minus
// http://localhost:8080/shopStatus/servingStaff/:shopStatusId/?action=action&activityId=activityId
exports.staffStartStopServing = async (req, res, next) => {
  const shopId = req.params.shopStatusId;
  const staffId = req.userId;
  const action = req.query.action;
  const activityId = req.query.activityId;

  try {
    const staff = await User.findById(staffId);
    if (!staff) {
      const error = new Error("Could not find staff");
      error.statusCode = 404;
      return next(error);
    }
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("Could not find shop");
      error.statusCode = 404;
      return next(error);
    }
    const shopActivity = await ShopActivity.findById(activityId);
    if (!shopActivity) {
      const error = new Error("Could not find shop activity");
      error.statusCode = 404;
      return next(error);
    }

    // let activeServer = await getNumberOfActiveServerOfActivity(activityId);
    const allShopActivities = await shopActivityController.backendGetAllShopActivities(
      shopId
    );

    const relatedQueues = await Queue.find({
      queue_activityId: activityId,
      queue_queueStatus: 1,
    });
    if (!staff.user_servingShopActivityId) {
      staff.user_servingShopActivityId = [];
    }

    if (action == "add") {
      shopStatus.shopStatus_numberOfServer =
        shopStatus.shopStatus_numberOfServer + 1;
      await createServerPerformance(staffId, activityId, shopId);

      await staff.user_servingShopActivityId.push(activityId);

      for (let i = 0; i < relatedQueues.length; i++) {
        relatedQueues[i].queue_numberOfServer =
          relatedQueues[i].queue_numberOfServer + 1;
        await relatedQueues[i].save();
      }
    }
    if (action == "minus") {
      shopStatus.shopStatus_numberOfServer =
        shopStatus.shopStatus_numberOfServer - 1;
      await updateServerPerformanceEndtime(staffId, activityId);

      staff.user_servingShopActivityId = staff.user_servingShopActivityId.filter(
        (item) => item != activityId
      );

      for (let i = 0; i < relatedQueues.length; i++) {
        relatedQueues[i].queue_numberOfServer =
          relatedQueues[i].queue_numberOfServer - 1;
        await relatedQueues[i].save();
      }
    }
    await shopStatus.save();
    await staff.save();

    let availableShopActivities = [];
    let currentlyServingActivities = [];
    let currentlyServingActivitiesId = staff.user_servingShopActivityId;

    // for (let i = 0; i < currentlyServingActivitiesId.length; i++) {
    //   let activity = allShopActivities.filter(
    //     (activity) => activity._id == currentlyServingActivitiesId[i]
    //   );
    //   currentlyServingActivities.push(activity[0]);
    // }
    // console.log("currentlyServingActivities", currentlyServingActivities);

    // if (currentlyServingActivitiesId.length > 0) {
    //   for (let i = 0; i < currentlyServingActivitiesId.length; i++) {
    //     let activity = allShopActivities.filter(
    //       (activity) => activity._id != currentlyServingActivitiesId[i]
    //     );
    //     console.log("to be push into availableShopActivities", activity);
    //     availableShopActivities.push(activity[0]);
    //   }
    // } else {
    //   availableShopActivities = allShopActivities;
    // }
    currentlyServingActivities = allShopActivities.filter((allId) =>
      currentlyServingActivitiesId.includes(allId._id)
    );
    availableShopActivities = allShopActivities.filter(
      (allId) => !currentlyServingActivitiesId.includes(allId._id)
    );
    console.log("currentlyServingActivities", currentlyServingActivities);
    console.log("availableShopActivities", availableShopActivities);

    res.status(200).json({
      message: `${action} server successfully`,
      user: staff,
      currentlyServingActivities: currentlyServingActivities,
      availableShopActivities: availableShopActivities,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// updat the time desired to clear the queue
// http://localhost:8080/shopStatus/queueTime/:shopId/?time=time
exports.updateTimeToClearQueue = async (req, res, next) => {
  const shopId = req.params.shopId;
  const time = req.query.time;
  console.log("enter updateTimeToClearQueue");
  // console.log("time", time);
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("Could not find shop");
      error.statusCode = 404;
      return next(error);
    }
    // console.log("shopStatus", shopStatus);
    shopStatus.shopStatus_timeToClearQueue = time;
    await shopStatus.save();
    // console.log("shopStatus", shopStatus);
    const result = await combinedPerformanceController.warningToAddServerForStageOne(
      shopId
    );
    res.status(200).json({
      message: `update clear queue time successfully`,
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTimeToClearQueue = async (shopId) => {
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("Could not find shop");
      error.statusCode = 404;
      throw error;
    }
    return shopStatus.shopStatus_timeToClearQueue;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
