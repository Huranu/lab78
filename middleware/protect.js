const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
// const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;


 if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies["access-token"];
  }


  if (!token) {
    throw new MyError("Ta ehleed login hiine uu. Uildel hiih bolomjgui..", 401);
  }

  const tokenObj = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  req.userId = tokenObj.id;
// console.log(tokenObj.id);
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError("Tanii erh hurehgui baina.." + req.userRole, 403);
    }
    next();
  };
};
