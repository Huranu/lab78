const express = require("express");

const {createProject , getProjects , getProject , deleteProject, updateProject,addProjectToDep} = require("../controller/projects");
const {getProMilestones} = require("../controller/milestones");
  
  const router = express.Router();
  
  router.route("/").post(createProject).get(getProjects);


  router.route("/:proId").get(getProject).delete(deleteProject).put(updateProject);

  router.route("/:proId/add-dep").post(addProjectToDep);

  // Milestones
  router.route("/:proId/milestones").get(getProMilestones);


  module.exports = router;