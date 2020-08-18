const express = require("express");

const userController = require("../controllers/user");
const authValidation = require("../validation/authValidation");

const router = express.Router();

// to create a new user in the system
// http://localhost:8080/user/signup
router.post("/signup", authValidation.singupValidation, userController.signup);

// signin
// http://localhost:8080/user/signin
router.post("/signin", authValidation.singinValidation, userController.signin);

// find shop By userId
// http://localhost:8080/user/:userId
router.get("/:userId", userController.findShopIdByUserId);

// findUserById
// http://localhost:8080/user/user/:userId
router.get("/user/:userId", userController.findUserById);

module.exports = router;
