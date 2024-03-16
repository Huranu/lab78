const express = require("express");

const {createMilestone , getMilestone , deleteMilestone , updateMilestone,} = require("../controller/milestones");
  
  const router = express.Router();
  
  router.route("/").post(createMilestone);


  router.route("/:mileId").get(getMilestone).delete(deleteMilestone).put(updateMilestone);
  
  module.exports = router;