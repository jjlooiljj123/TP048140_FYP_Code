const express = require("express");

const isAuth = require("../middleware/is-auth");
const shopValidation = require("../validation/shopValidation");
const shopController = require("../controllers/shop");

const multer = require("multer");
const upload = multer({ dest: "images/" });

const router = express.Router();

// for owner to create a shop
// http://localhost:8080/shop
router.post(
  "/",
  isAuth,
  // upload.single("image"),
  // shopValidation.createShop,
  shopController.createShop
);

// to get all shops
// http://localhost:8080/shop
router.get("/", shopController.getShops);

// to get a specific shop
// http://localhost:8080/shop/:shopId
router.get("/:shopId", shopController.getShop);

// to edit shop information
// http://localhost:8080/shop/:shopId
router.put(
  "/:shopId",
  isAuth,
  // shopValidation.createShop,
  shopController.updateShop
);

// to delete a shop
// http://localhost:8080/shop/:shopId
router.delete("/:shopId", isAuth, shopController.deleteShop);

module.exports = router;
