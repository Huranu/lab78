const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const {parseDateStrings}=require('../utils/date');

exports.createMilestone = asyncHandler(async (req, res, next) => {

    const { title,description,due_date,start_date,end_date,project_id } = req.body;
    const milestone = await prisma.milestone.create({
    data: {
      title,
      description,
      due_date:parseDateStrings(due_date),
      start_date: parseDateStrings(start_date),
      end_date : end_date ? parseDateStrings(end_date) : null,
      project_id 
    },
  })
  res.status(200).json({
    success: true,
    data: milestone
  });
})

  exports.getProMilestones = asyncHandler(async (req, res, next) => {
    const milestones = await prisma.milestone.findMany({
      where:{
        project_id:Number(req.params.proId)
      }
    });
    res.status(200).json({
        success: true,
        data: milestones,
      });
  });

  exports.getMilestone = asyncHandler(async (req, res, next) => {
    const milestone = await prisma.milestone.findUnique({
    where:{
      id:Number(req.params.mileId),
    },
  })
  if (!milestone) {
    throw new MyError("Iim id-tai milestone baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: milestone,
  });
  });

  exports.deleteMilestone = asyncHandler(async (req, res, next) => {
    const milestone = await prisma.milestone.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!project) {
    throw new MyError("Iim id-tai milestone baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: milestone,
  });
  });

  exports.updateMilestone = asyncHandler(async (req, res, next) => {
    const milestone = await prisma.milestone.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!milestone) {
      throw new MyError("Iim id-tai milestone baihgui baina", 400);
    }
    const { title,description } = req.body;
    const updatedMilestone = await prisma.milestone.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
        title,
        description,
        due_date,
        end_date,
        project_id
    },
  })

  res.status(200).json({
    success: true,
    data: updatedMilestone,
  });
  });

  exports.getDepMilestones = asyncHandler(async (req, res, next) => { 
    const result = await prisma.department.findUnique({
      where: { id: Number(req.params.depId) },
      include: {
        project_dep: {
          include: { project: { include: { milestone: true } } }, // Nested include for milestone
        },
      },
    });

    const milestones = result.project_dep.flatMap(dep => dep.project.milestone);

    res.status(200).json({
        success: true,
        data: milestones,
      });
  });