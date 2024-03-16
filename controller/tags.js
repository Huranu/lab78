const asyncHandler = require("express-async-handler");
// const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

exports.createTag = asyncHandler(async (req, res, next) => {

    const { title, color } = req.body;
    const result = await prisma.tag.create({
    data: {
      title,
      color,
    },
  })
    res.json(result);
  });

  exports.getTags = asyncHandler(async (req, res, next) => {
    const tags = await prisma.tag.findMany();
    res.status(200).json({
      success: true,
      data: tags,
    });
  });

  exports.getTag = asyncHandler(async (req, res, next) => {
    const tag = await prisma.tag.findUnique({
    where:{
      id:Number(req.params.id),
    },
  })
  if (!tag) {
    throw new MyError("Iim id-tai tag baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: tag,
  });
  });

  exports.deleteTag = asyncHandler(async (req, res, next) => {
    const tag = await prisma.tag.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!tag) {
    throw new MyError("Iim id-tai tag baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: tag,
  });
  });

  exports.updateTag = asyncHandler(async (req, res, next) => {
    const tag = await prisma.tag.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!tag) {
      throw new MyError("Iim id-tai tag baihgui baina", 400);
    }
    const { title, color } = req.body;
    const updatedTag = await prisma.tag.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
      title,
      color,
    },
  })

  res.status(200).json({
    success: true,
    data: updatedTag,
  });
  });

  exports.getTaskTags = asyncHandler(async (req, res, next) => {
    const {id}=req.body;
    const tags = await prisma.task_tag.findMany({
      where: {
        task_id:id
      },
      select: {
        tag:true
      }
    });
    res.status(200).json({
      success: true,
      data: tags,
    });
  });

  exports.addTagToTask = asyncHandler(async (req, res, next) => {
    const {tag_id}=req.body;
    const result = await prisma.task_tag.create({
      data:{
        task_id:Number(req.params.id),
        tag_id
      }
  })
  res.status(200).json({
    success: true,
    data: result,
  });
  });

  exports.deleteTagFromTask = asyncHandler(async (req, res, next) => {
    const result = await prisma.task_tag.create({
      where:{
        task_id:Number(req.params.id),
        tag_id:Number(req.params.tagId)
      }
  })
  res.status(200).json({
    success: true,
    data: result,
  });
  });