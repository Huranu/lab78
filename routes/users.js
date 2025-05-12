const express = require("express");

const {
  getAllUsers,
} = require("../controller/users");

const router = express.Router();

router.route("/").get(getAllUsers);

module.exports = router;
