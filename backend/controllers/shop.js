const { validationResult } = require("express-validator"); // req body validation done in the routes

const Shop = require("../models/Shop");
const User = require("../models/User");

const {
  createShopStatus,
  deleteShopStatus,
  updateShopStatus,
} = require("../controllers/shopStatus"); //relate the shopstatus when create, update, delete shop info

// create shop for the very first time
// http://localhost:8080/shop
exports.createShop = async (req, res, next) => {
  console.log("enter createShop");
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation failed, entered data is incorrect.");
  //   error.statusCode = 422;
  //   return next(error); // go to the error handling meiddleware
  // }
  // console.log("file", req.file);
  // // console.log("body", req.body.keyyy);
  // console.log("body", req.body);

  // for image upload but not working at the moment
  // if (!req.file) {
  //   const error = new Error("No image provided");
  //   error.statusCode = 422;
  //   return next(error); // go to the error handling meiddleware
  // }

  // const imageUrl = req.file.path.replace("\\", "/");

  // console.log("imageUrl", imageUrl);

  const shop = new Shop({
    shop_shopName: req.body.shopName,
    shop_branch: req.body.branch,
    shop_streetAddress1: req.body.streetAddress1,
    shop_streetAddress2: req.body.streetAddress2,
    shop_streetAddress3: req.body.streetAddress3,
    shop_city: req.body.city,
    shop_postalCode: req.body.postalCode,
    shop_state: req.body.state,
    shop_country: req.body.country,
    shop_directory: req.body.directory,
    shop_imageUrl: req.body.imageUrl,
    // shop_imageUrl: imageUrl,
    shop_monOpen: req.body.monOpen,
    shop_tueOpen: req.body.tueOpen,
    shop_wedOpen: req.body.wedOpen,
    shop_thuOpen: req.body.thuOpen,
    shop_friOpen: req.body.friOpen,
    shop_satOpen: req.body.satOpen,
    shop_sunOpen: req.body.sunOpen,
    shop_holOpen: req.body.holOpen,
    shop_monClose: req.body.monClose,
    shop_tueClose: req.body.tueClose,
    shop_wedClose: req.body.wedClose,
    shop_thuClose: req.body.thuClose,
    shop_friClose: req.body.friClose,
    shop_satClose: req.body.satClose,
    shop_sunClose: req.body.sunClose,
    shop_holClose: req.body.holClose,
    shop_owner: req.userId, //the req.yserId is from the is-auth.js, where req.userId is set to the ownerID from the JWT
  });
  try {
    // check whether the user is authorized to create shop
    const owner = await User.findById(req.userId); // find the owner of the shop
    if (owner.user_role != "owner") {
      const error = new Error("Not authorize to create shop.");
      error.statusCode = 401;
      return next(error);
    }

    console.log("shop", shop);
    await shop.save(); // create a document in the shops collection
    console.log("here 1");
    owner.user_shop = shop;
    await owner.save(); //update the shop-owner relationship in the owner document
    console.log("here 2");

    await createShopStatus(
      shop._id,
      shop,
      owner,
      req.body.shopName,
      req.body.branch,
      req.body.imageUrl,
      req.body.directory
    ); // create shop status
    console.log("here 3");
    res.status(201).json({
      message: "Shop created successfully",
      shop: shop,
      owner: { _id: owner._id, name: owner.user_name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    next(err);
  }
};

// get all shops
// http://localhost:8080/shop/?page=3
exports.getShops = async (req, res, next) => {
  //pagination
  const currentPage = req.query.page || 1;
  const shopPerPage = 2;
  try {
    const totalShops = await Shop.find().countDocuments();
    const shops = await Shop.find()
      .skip((currentPage - 1) * shopPerPage)
      .limit(shopPerPage);

    res.status(200).json({
      message: "Fetch Shop successfully",
      shops: shops,
      totalShops: totalShops,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get a specific shop
// http://localhost:8080/shop/5ea137898f749432701f32ba
exports.getShop = async (req, res, next) => {
  const shopId = req.params.shopId;
  const shop = await Shop.findById(shopId);
  try {
    if (!shop) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Shop fetched",
      shop: shop,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// upadte shop information
// http://localhost:8080/shop/:shopId
exports.updateShop = async (req, res, next) => {
  const shopId = req.params.shopId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return next(error);
  }
  try {
    const shop = await Shop.findById(shopId);
    //check if see whether shop exist
    if (!shop) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }
    //check if see whether the editor has the autority to edit
    if (shop.shop_owner.toString() != req.userId) {
      const error = new Error("Not Authorized!");
      error.statusCode = 404;
      return next(error);
    }
    shop.shop_shopName = req.body.shopName;
    shop.shop_branch = req.body.branch;
    shop.shop_streetAddress1 = req.body.streetAddress1;
    shop.shop_streetAddress2 = req.body.streetAddress2;
    shop.shop_streetAddress3 = req.body.streetAddress3;
    shop.shop_city = req.body.city;
    shop.shop_postalCode = req.body.postalCode;
    shop.shop_state = req.body.state;
    shop.shop_country = req.body.country;
    shop.shop_directory = req.body.directory;
    shop.shop_imageUrl = req.body.imageUrl;
    shop.shop_monOpen = req.body.monOpen;
    shop.shop_tueOpen = req.body.tueOpen;
    shop.shop_wedOpen = req.body.wedOpen;
    shop.shop_thuOpen = req.body.thuOpen;
    shop.shop_friOpen = req.body.friOpen;
    shop.shop_satOpen = req.body.satOpen;
    shop.shop_sunOpen = req.body.sunOpen;
    shop.shop_holOpen = req.body.holOpen;
    shop.shop_monClose = req.body.monClose;
    shop.shop_tueClose = req.body.tueClose;
    shop.shop_wedClose = req.body.wedClose;
    shop.shop_thuClose = req.body.thuClose;
    shop.shop_friClose = req.body.friClose;
    shop.shop_satClose = req.body.satClose;
    shop.shop_sunClose = req.body.sunClose;
    shop.shop_holClose = req.body.holClose;
    const result = await shop.save();
    await updateShopStatus(
      shopId,
      result,
      req.body.shopName,
      req.body.branch,
      req.body.imageUrl,
      req.body.directory
    );
    res.status(200).json({
      message: "Shop Information Updated",
      shop: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// delete a shop
// http://localhost:8080/shop/:shopId
exports.deleteShop = async (req, res, next) => {
  const shopId = req.params.shopId;
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      const error = new Error("No Shop found!");
      error.statusCode = 404;
      return next(error);
    }
    if (req.userId != shop.owner.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 404;
      return next(error);
    }

    await Shop.findByIdAndRemove(shopId);
    deleteShopStatus(shopId);

    const owner = await User.findById(req.userId);
    owner.user_shop = null;
    await owner.save();

    res.status(200).json({ message: "Deleted Shop." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
