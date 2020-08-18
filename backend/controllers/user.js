const { validationResult } = require("express-validator"); // req body validation done in the routes
const bcrypt = require("bcryptjs"); // for password encryption
const jwt = require("jsonwebtoken"); // for creating an authorized token for the logged in user

const User = require("../models/User");
const Shop = require("../models/Shop");

// create a user in DB (customer, owner, staff)
// http://localhost:8080/user/signup
exports.signup = async (req, res, next) => {
  console.log("backend sign up triggered");
  const errors = await validationResult(req); //for the express validator to throw message
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    // console.log("Express validator error handling");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error); // go to the error handling middleware
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;
  const shopId = req.body.shopId || null;
  let shop;
  try {
    // find whether the email has already been registered in the system
    // no duplicate email
    const isEmailExist = await User.findOne({ user_email: email });
    if (isEmailExist) {
      const error = new Error("E-Mail address already exists!");
      error.statusCode = 403;
      throw error;
    }
    // check whether the shopId is valid
    if (role == "staff" && shopId != null) {
      shop = await Shop.findById(shopId);
      if (!shop) {
        const error = new Error("No shop found.");
        error.statusCode = 404;
        throw error;
      }
    }
    // hashed the password and save the hased password
    const hashedPwd = await bcrypt.hash(password, 12); // hash password
    //creating user
    const user = new User({
      user_email: email,
      user_password: hashedPwd,
      user_name: name,
      user_role: role,
    });

    const result = await user.save(); // create a new user in DB

    // if the staff update the shop Object directly to the user record
    // this is not done when creating user becasue the shop might not be created at that moment
    if (role == "staff") {
      result.user_shop = shop;
      await result.save();
    }

    res.status(201).json({
      message: "User created!",
      result: result,
    });
  } catch (err) {
    // console.log("last validator");
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // needed in the async await code, to go to the error handling middleware
  }
};

// user signin process
// http://localhost:8080/user/signin
exports.signin = async (req, res, next) => {
  console.log("backend sign in triggered");
  const errors = await validationResult(req); //for the express validator to throw message
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error); // go to the error handling middleware
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ user_email: email }); // check if email exist
    if (!user) {
      const error = new Error("An user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const passwordIsEqual = await bcrypt.compare(password, user.user_password); // check if password correct
    if (!passwordIsEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      // signin with token
      {
        email: loadedUser.user_email,
        userId: loadedUser._id.toString(),
      },
      process.env.TOKEN_SECRET
      // { expiresIn: "24h" }
    );

    let shopId;
    if (!loadedUser.user_shop) {
      shopId = "";
    } else {
      shopId = loadedUser.user_shop._id;
    }
    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
      role: loadedUser.user_role,
      shopId: shopId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // needed in the async await code, to go to the error handling middleware
  }
};

// findUserById
// http://localhost:8080/user/:userId
exports.findShopIdByUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      throw error;
    }
    if (!user.user_shop._id) {
      const error = new Error("shopId not found.");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      shopId: user.user_shop._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // needed in the async await code, to go to the error handling middleware
  }
};

// findUserById
// http://localhost:8080/user/user/:userId
exports.findUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      user: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // needed in the async await code, to go to the error handling middleware
  }
};
