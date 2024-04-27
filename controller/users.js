const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const bcrypt=require('bcrypt');
const {getJsonWebToken}=require('../utils/jwt');

exports.login = asyncHandler(async (req, res, next) => {
  const { email,password } = req.body;
  if (!email || !password) {
    throw new MyError("Ugugdul dutuu baina..", 400);
  }
  const user = await prisma.user.findUnique({
    where:{
      email
    },
  })
  if (!user) {
    throw new MyError("Email esvel nuuts ug buruu bainaaaaa", 400);
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new MyError("Email esvel nuuts ug buruu bainnn", 400);
  }
  console.log('object');

  const token = getJsonWebToken(user.id);
  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };


res.status(200).cookie("task-token", token, cookieOption).json({
  success: true,
  token,
  userId:user.id,
  depId:user.department_id
});
})

exports.register = asyncHandler(async (req, res, next) => {
  const { email,password } = req.body;
  if (!email || !password) {
    throw new MyError("Ugugdul dutuu baina..", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password:hashedPassword, 
    },
  })

res.status(201).json({
  success: true,
  data: user,
});
})

exports.createUser = asyncHandler(async (req, res, next) => {

    const { email,fname,lname,password,role,department_id } = req.body;
    const user = await prisma.user.create({
    data: {
      email,fname,lname,password,role,department_id 
    },
  })
  res.status(201).json({
    success: true,
    data: user
  });
})


  exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await prisma.user.findMany();
    console.log(users);
    res.status(200).json({
        success: true,
        data: users,
      });
  });

  exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
    where:{
      id:req.userId,
    },
  })
  if (!user) {
    throw new MyError("Iim id-tai user baihgui baina.", 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
  });

  exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!user) {
    throw new MyError("Iim id-tai user baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
  });

  exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!user) {
      throw new MyError("Iim id-tai user baihgui baina", 400);
    }
    const { name } = req.body;
    const updatedUser = await prisma.user.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
      name
    },
  })

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
  });