const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');


exports.postSubtask = asyncHandler(async (req, res, next) => {
  const {title} = req.body;
  console.log(title);
  if(title==''){
    throw new MyError("Subtask title is missing!",400);
  }
  const subtask = await prisma.subtask.create({
  data: {
    title:title,
    status:false,
    task_id:Number(req.params.taskId),
  },
})
res.status(200).json({
  success: true,
  data: subtask
});
})

  exports.getTaskSubtasks = asyncHandler(async (req, res, next) => {
    const {taskId}=req.params;
    const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let Query = {  };

  if (req.query) {
    Query.where = req.query;
    Query.where = {taskId:Number(taskId)}
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
  console.log(Query.where);
    const subtasks = await prisma.subtask.findMany({

    });
    res.status(200).json({
        success: true,
        data: subtasks,
      });
  });

  exports.getTaskSubtasks = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    const { sort, select, status } = req.query;

    let query = {
        where: {
            task_id: Number(taskId),
        },
    };

    if (status !== undefined) {
        query.where.status = Boolean(status);
    }

    const options = {};

    if (select) {
        options.attributes = select.split(',');
    }

    if (sort) {
        options.order = sort
            .split(" ")
            .map(el => [
                el.charAt(0) === "-" ? el.substring(1) : el,
                el.charAt(0) === "-" ? "DESC" : "ASC",
            ]);
    }

    const subtasks = await prisma.subtask.findMany({
        ...query,
        ...options,
    });

    res.status(200).json({
        success: true,
        data: subtasks,
    });
});


  exports.getSubtask = asyncHandler(async (req, res, next) => {
    const subtask = await prisma.subtask.findUnique({
    where:{
      id:Number(req.params.id),
    },
  })
  if (!subtask) {
    throw new MyError("Iim id-tai subtask baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: subtask,
  });
  });

  exports.deleteSubtask = asyncHandler(async (req, res, next) => {
    const subtask = await prisma.subtask.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!project) {
    throw new MyError("Iim id-tai subtask baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: subtask,
  });
  });

  exports.updateSubtask = asyncHandler(async (req, res, next) => {
    const { status} = req.body;
    const subtask = await prisma.subtask.update({
      where:{
        id:Number(req.params.subId),
      },
      data: {
        status,
    },
    })
    if (!subtask) {
      throw new MyError("Iim id-tai subtask baihgui baina", 400);
    }
  res.status(200).json({
    success: true,
    data: subtask,
  });
  });