const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // the header is set in frontend (Authorization: "Bearer sadasdaseasdasdeasd")
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  // to get the real token after the "Bearer "
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId; // store userId in the 'req' object so that after using isAuth, we will have userId in the 'req'  object
  next();
};
