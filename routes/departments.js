const express = require("express");

const {createDep , getDep , getDeps , deleteDep, updateDep} = require("../controller/departments");
const {getDepProjects} = require("../controller/projects");
const { getDepartmentTasks } = require("../controller/tasks");
const { getDepMilestones } = require("../controller/milestones");
const { getDepSprints } = require("../controller/sprints");
const {protect} = require("../middleware/protect");
  
  const router = express.Router();
  
  router.route("/").post(createDep).get(getDeps);


  router.route("/:id").get(getDep).delete(deleteDep).put(updateDep);
  
  // Projects
  router.route("/:depId/projects").get(protect,getDepProjects);

  // Tasks
  router.route("/:depId/tasks").get(getDepartmentTasks);

  // Milestones
  router.route("/:depId/milestones").get(getDepMilestones);

  // Sprints
  router.route("/:depId/sprints").get(getDepSprints);
  
  module.exports = router;