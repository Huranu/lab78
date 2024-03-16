const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');

exports.addAssigneesToTask = asyncHandler(async (req, res, next) => {
    const {user_id}=req.body;
    const result = await prisma.user_task.create({
      data:{
        task_id:Number(req.params.taskId),
        user_id
      }
  })
  res.status(200).json({
    success: true,
    data: result,
  });
  });

  exports.deleteAssigneesFromTask = asyncHandler(async (req, res, next) => {
    const {user_id}=req.body;
    const result = await prisma.user_task.delete({
      where:{
        task_id:Number(req.params.id),
        user_id
      }     
  })
  res.status(200).json({
    success: true,
    data: result,
  });
  });