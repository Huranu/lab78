const express = require("express");

const {getAllTasks , getTask , deleteTask , updateTask, createTask,getTaskUsers} = require("../controller/tasks");
const {postSubtask , getTaskSubtasks, updateSubtask} = require("../controller/subtask");
const {getTaskTags} = require("../controller/tags");
const {protect} = require("../middleware/protect");
  
  const router = express.Router();
  
  router.route("/").get(protect,getAllTasks).post(protect,createTask);


  router.route("/:taskId").get(getTask).delete(deleteTask).put(updateTask);

  // Users
  router.route("/:taskId/users").get(getTaskUsers);

  // Subtask
  router.route("/:taskId/subtasks").get(getTaskSubtasks).post(protect,postSubtask);
  router.route("/:taskId/subtasks/:subId").put(protect,updateSubtask);
  
  // Tag
  router.route("/:taskId/tags").get(getTaskTags);

  module.exports = router;