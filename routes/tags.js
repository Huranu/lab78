const express = require("express");

const {createTag} = require("../controller/tags");
  
  const router = express.Router();
  
  router.route("/").post(createTag);
  
  module.exports = router;