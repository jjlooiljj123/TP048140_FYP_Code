const { validationResult } = require("express-validator");

const QueueStructure = require("../models/QueueStructure");

// create a queue structure for a specific shop, will be called in queue controller
// called in queue controller
exports.createQueueStructure = async (
  stageNumber,
  nameOfStage,
  description,
  shopId
) => {
  try {
    const queueStructure = new QueueStructure({
      queueStructure_stageNumber: stageNumber,
      queueStructure_nameOfStage: nameOfStage,
      queueStructure_description: description,
      queueStructure_shop: shopId,
    });
    const result = await queueStructure.save();
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve queue structures for a specific shop
// http://localhost:8080/queueStructure/:shopId
exports.getQueueStructures = async (req, res, next) => {
  const shopId = req.params.shopId;
  try {
    const shopQueueStructures = await QueueStructure.find({
      queueStructure_shop: shopId,
    });
    res.status(200).json({
      message: "Structures fetched.",
      shopQueueStructures: shopQueueStructures,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// // get a specific queue structure by id
// exports.getQueueStructure = async (structureId) => {
//   try {
//     const queueStructure = await QueueStructure.findById(structureId);
//     return queueStructure;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };
