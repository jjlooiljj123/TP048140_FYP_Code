const { body } = require("express-validator");

// const User = require("../models/User");

exports.singupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    // .custom((value, { req }) => {
    //   // check whether the email existed
    //   return User.findOne({ email: value }).then((userDoc) => {
    //     if (userDoc) {
    //       return Promise.reject("E-Mail address already exists!");
    //     }
    //   });
    // })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 8 }),
  body("name").trim().not().isEmpty(),
  body("role").trim().not().isEmpty(),
];

exports.singinValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("password").trim().isLength({ min: 8 }),
];
