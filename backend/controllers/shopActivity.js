const { validationResult } = require("express-validator");

const ShopActivity = require("../models/ShopActivity");

// create activities provided by that shop
// will be called in queue controller
exports.createShopActivity = async (
  activity,
  description,
  priority,
  queueStructure,
  shopStatus,
  shopStage,
  defaultTimeToServeACustomer
) => {
  try {
    const shopActivity = new ShopActivity({
      shopActivity_activity: activity,
      shopActivity_description: description,
      shopActivity_priority: priority,
      shopActivity_queueStructure: queueStructure,
      shopActivity_shopStatus: shopStatus,
      shopActivity_queueStage: shopStage,
      shopActivity_defaultTimeToServeACustomer: defaultTimeToServeACustomer,
    });
    const result = await shopActivity.save();
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return err;
  }
};

// get shop activities for that shop
// http://localhost:8080/shopActivity/allActivities/:shopId/?stage=stage
exports.getAllShopActivities = async (req, res, next) => {
  const shopId = req.params.shopId;
  const stage = req.query.stage || 0;
  let activityForStage;
  let shopActivity;
  let totalStages;
  try {
    if (stage == 0) {
      shopActivity = await ShopActivity.find({
        shopActivity_shopStatus: shopId,
      }).sort({ shopActivity_queueStage: 1 });
    } else {
      shopActivity = await ShopActivity.find({
        shopActivity_shopStatus: shopId,
        shopActivity_queueStage: stage,
      });
    }
    activityForStage = await ShopActivity.find({
      shopActivity_shopStatus: shopId,
    }).sort({ shopActivity_queueStage: -1 });
    totalStages = activityForStage[0].shopActivity_queueStage;

    res.status(200).json({
      message: "Shop Activities fetched.",
      shopActivities: shopActivity,
      totalStages: totalStages,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.backendGetAllShopActivities = async (shopId) => {
  try {
    shopActivity = await ShopActivity.find({
      shopActivity_shopStatus: shopId,
    }).sort({ shopActivity_queueStage: 1 });

    return shopActivity;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get specific shop activitiy
// http://localhost:8080/shopActivity/:activityId
exports.getShopActivity = async (req, res, next) => {
  const activityId = req.params.activityId;
  try {
    const shopActivity = await ShopActivity.findById(activityId);
    res.status(200).json({
      message: "Shop Activitiy fetched.",
      shopActivity: shopActivity,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get specific shop activity
// called in shopStatus Cntroller
exports.getShopActivityByStage = async (shopId, stage) => {
  try {
    const shopActivity = await ShopActivity.find({
      shopActivity_shopStatus: shopId,
      shopActivity_queueStage: stage,
    });
    return shopActivity;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
