const express = require("express");
const {protect} = require("../middleware/protect");

const {createUser,getUsers,getUser} = require("../controller/users");
const {getUserTasks} = require("../controller/tasks");

  
  const router = express.Router();
  
  router.route("/").post(createUser).get(getUsers);

  router.route("/tasks").get(protect,getUserTasks);

  router.route("/profile").get(protect,getUser);
  
  
  module.exports = router;