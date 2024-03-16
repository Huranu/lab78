const express = require("express");

const {login} = require("../controller/users");
  
  const router = express.Router();
  
  router.route("/").post(login);
  
  module.exports = router;