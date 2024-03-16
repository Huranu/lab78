const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const {parseDateStrings}=require('../utils/date');

exports.createTask = asyncHandler(async (req, res, next) => {

    const { title,description,weight,start_date,end_date,due_date,stage,project_id,milestone_id,sprint_id,users,deps} = req.body;
    try{
      const task = await prisma.task.create({
        data: {
          title,
          description,
          weight,
          due_date: parseDateStrings(due_date),
          start_date: parseDateStrings(start_date),
          end_date : end_date ? parseDateStrings(end_date) : null,
          stage,
          owner_id : req.userId,
          project_id,
          milestone_id,
          sprint_id
        },
      });
      if(users.length!=0){
        users.map(async (e)=> {
          await prisma.user_task.create({
            data:{
              task_id:task.id,
              user_id:e
            }
          })
        })
      }
      if(deps.length!=0){
        deps.map(async (e)=> {
          await prisma.task_dep.create({
            data:{
              task_id:task.id,
              department_id:e
            }
          })
        })
      }
      res.status(200).json({
        success: true,
      });
    }
    catch(e){
      console.log(e);
    }
})

  exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let Query = {  };

  if (req.query) {
    Query.where = req.query;
    if(Query.where.milestone_id){
      Query.where.milestone_id=Number(Query.where.milestone_id);
    }
    if(Query.where.sprint_id){
      Query.where.sprint_id=Number(Query.where.sprint_id);
    }
    if(Query.where.project_id){
      Query.where.project_id=Number(Query.where.project_id);
    }
  }
  if (select) {
    Query.attributes = select;
  }
  if (sort) {
    Query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }
    const tasks = await prisma.task.findMany(Query);
    res.status(200).json({
        success: true,
        data: tasks,
      });
  });

  exports.getTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.findUnique({
    where:{
      id:Number(req.params.taskId),
    },
  })
  if (!task) {
    throw new MyError("Iim id-tai task baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: task,
  });
  });

  exports.deleteTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.delete({
      where:{
        id:Number(req.params.taskId),
      },
  })
  if (!task) {
    throw new MyError("Iim id-tai task baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: task,
  });
  });

  exports.updateTask = asyncHandler(async (req, res, next) => {
    const { title,description,due_date,stage,weight,end_date,project_id,milestone_id,sprint_id} = req.body;
    const task = await prisma.task.update({
      where:{
        id:Number(req.params.taskId),
      },
      data: {
        title,
        description,
        weight,
        stage,
        due_date,
        end_date,
        project_id,
        milestone_id,
        sprint_id,
    },
    })
    if (!task) {
      throw new MyError("Iim id-tai task baihgui baina", 400);
    }

  res.status(200).json({
    success: true,
    data: task,
  });
  });

  exports.getUserTasks = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let Query = {  };

  if (req.query) {
    Query.where = req.query;
  }
  if (select) {
    Query.attributes = select;
  }
  if (sort) {
    Query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }
    const tasks = await prisma.user_task.findMany({
      select:{
        task:true
      },
      where:{
        user_id:Number(req.userId),
        task: { 
          stage:Query.where.stage,
        }
      },
    });
    const formattedTasks = tasks.map((item) => item.task);
    res.status(200).json({
        success: true,
        data: formattedTasks,
      });
  });

  exports.getDepartmentTasks = asyncHandler(async (req, res, next) => { 
    const tasks = await prisma.task_dep.findMany({
      select:{
        task:true
      },
      where:{
        department_id:Number(req.params.depId)
      },
    });
    const formattedTasks = tasks.map((item) => item.task);
    res.status(200).json({
        success: true,
        data: formattedTasks,
      });
  });

  exports.getTaskUsers = asyncHandler(async (req, res, next) => { 
    const {taskId}=req.params;
    const users = await prisma.user_task.findMany({
      select:{
        user:true
      },
      where:{
        task_id:Number(taskId)
      },
    });
    const formattedUsers = users.map((item) => item.user);
    res.status(200).json({
        success: true,
        data: formattedUsers,
      });
  });

