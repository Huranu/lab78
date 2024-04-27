const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const {parseDateStrings}=require('../utils/date');

exports.createProject = asyncHandler(async (req, res, next) => {

    const { title,description,start_date,end_date,due_date,deps } = req.body;
    const project = await prisma.project.create({
    data: {
      title,
      description,
      start_date: parseDateStrings(start_date),
      due_date:parseDateStrings(due_date),
      end_date : end_date ? parseDateStrings(end_date) : null,
    },
  })

  if(deps!=null&&deps.length!=0){
    deps.map(async (e)=> {
      await prisma.project_dep.create({
        data:{
          project_id:project.id,
          department_id:e
        }
      })
    })
  }

  res.status(200).json({
    success: true,
    data: {
      project,
    }
  });
})

  exports.getProjects = asyncHandler(async (req, res, next) => {
    const projects = await prisma.project.findMany();
    res.status(200).json({
        success: true,
        data: projects,
      });
  });

  exports.getUserProjects = asyncHandler(async (req, res, next) => {
    const projects = await prisma.project.findMany();
    res.status(200).json({
        success: true,
        data: projects,
      });
  });

  exports.getProject = asyncHandler(async (req, res, next) => {
    const project = await prisma.project.findUnique({
    where:{
      id:Number(req.params.proId),
    },
  })
  if (!project) {
    throw new MyError("Iim id-tai project baihgui baina", 400);
  }
  console.log(project);
  res.status(200).json({
    success: true,
    data: {project},
  });
  });

  exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await prisma.project.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!project) {
    throw new MyError("Iim id-tai project baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: project,
  });
  });

  exports.updateProject = asyncHandler(async (req, res, next) => {
    const project = await prisma.project.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!project) {
      throw new MyError("Iim id-tai project baihgui baina", 400);
    }
    const { title,description } = req.body;
    const updatedProject = await prisma.project.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
      title,
      description
    },
  })

  res.status(200).json({
    success: true,
    data: updatedProject,
  });
  });

  exports.getDepProjects = asyncHandler(async (req, res, next) => {
      const tasks = await prisma.project_dep.findMany({
        select:{
          project:true
        },
        where:{
          department_id:Number(req.params.depId)
        },
      });
      const formattedProjects = tasks.map((item) => item.project);
      res.status(200).json({
          success: true,
          data: formattedProjects,
        });
      })

      exports.addProjectToDep = asyncHandler(async (req, res, next) => {
        const {department_id}=req.body;
        const result = await prisma.project_dep.create({
          data:{
            project_id : Number(req.params.proId),
            department_id
          }
      })
      res.status(200).json({
        success: true,
        data: result,
      });
      });