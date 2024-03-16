const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
// const {PrismaClient}=require('@prisma/client');
// const prisma=new PrismaClient();

exports.createDep = asyncHandler(async (req, res, next) => {

    const { name } = req.body;
    const dep = await prisma.department.create({
    data: {
      name
    },
  })
  res.status(200).json({
    success: true,
    data: dep
  });
})

  exports.getDeps = asyncHandler(async (req, res, next) => {
    const deps = await prisma.department.findMany();
    res.status(200).json({
        success: true,
        data: deps,
      });
  });

  exports.getDep = asyncHandler(async (req, res, next) => {
    const dep = await prisma.department.findUnique({
    where:{
      id:Number(req.params.id),
    },
  })
  if (!dep) {
    throw new MyError("Iim id-tai dep baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: dep,
  });
  });

  exports.deleteDep = asyncHandler(async (req, res, next) => {
    const dep = await prisma.department.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!dep) {
    throw new MyError("Iim id-tai dep baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: dep,
  });
  });

  exports.updateDep = asyncHandler(async (req, res, next) => {
    const dep = await prisma.department.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!dep) {
      throw new MyError("Iim id-tai dep baihgui baina", 400);
    }
    const { name } = req.body;
    const updatedDep = await prisma.department.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
      name
    },
  })

  res.status(200).json({
    success: true,
    data: updatedDep,
  });
  });

