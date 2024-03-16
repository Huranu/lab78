const express = require("express");

const {createSprint , getSprint , deleteSprint , updateSprint,getSprints} = require("../controller/sprints");
  
  const router = express.Router();
  
  router.route("/").post(createSprint).get(getSprints);


  router.route("/:sprintId").get(getSprint).delete(deleteSprint).put(updateSprint);
  
  
  
  module.exports = router;