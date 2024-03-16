const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client');
const MyError=require('../utils/myError');
const {parseDateStrings}=require('../utils/date');

exports.createSprint = asyncHandler(async (req, res, next) => {

    const { title,description,due_date,end_date,start_date,project_id,milestone_id } = req.body;
    const sprint = await prisma.sprint.create({
    data: {
      title,
      description,
      start_date: parseDateStrings(start_date),
      due_date:parseDateStrings(due_date),
      end_date : end_date ? parseDateStrings(end_date) : null,
      project_id,
      milestone_id
    },
  })
  res.status(200).json({
    success: true,
    data: sprint
  });
})

  exports.getSprints = asyncHandler(async (req, res, next) => {
    const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let Query = {  };

  if (req.query) {
    Query.where = req.query;
    if(Query.where.project_id){
      Query.where.project_id=Number(Query.where.project_id);
    }
    if(Query.where.milestone_id){
      Query.where.milestone_id=Number(Query.where.milestone_id);
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
    const sprints = await prisma.sprint.findMany(Query);
    res.status(200).json({
        success: true,
        data: sprints,
      });
  });

  exports.getSprint = asyncHandler(async (req, res, next) => {
    const sprint = await prisma.sprint.findUnique({
    where:{
      id:Number(req.params.sprintId),
    },
  })
  if (!sprint) {
    throw new MyError("Iim id-tai sprint baihgui baina", 400);
  }
  console.log(sprint);
  res.status(200).json({
    success: true,
    data: sprint,
  });
  });

  exports.deleteSprint = asyncHandler(async (req, res, next) => {
    const sprint = await prisma.sprint.delete({
      where:{
        id:Number(req.params.id),
      },
  })
  if (!project) {
    throw new MyError("Iim id-tai sprint baihgui baina", 400);
  }
  res.status(200).json({
    success: true,
    data: sprint,
  });
  });

  exports.updateSprint = asyncHandler(async (req, res, next) => {
    const sprint = await prisma.sprint.findUnique({
      where:{
        id:Number(req.params.id),
      },
    })
    if (!sprint) {
      throw new MyError("Iim id-tai sprint baihgui baina", 400);
    }
    const { title,description,due_date,end_date,project_id,milestone_id  } = req.body;
    const updatedSprint = await prisma.milestone.update({
      where:{
        id:Number(req.params.id),
      },
    data: {
        title,
        description,
        due_date,
        end_date,
        project_id,
        milestone_id
    },
  })

  res.status(200).json({
    success: true,
    data: updatedSprint,
  });
  });

  exports.getDepSprints = asyncHandler(async (req, res, next) => { 
    const result = await prisma.department.findUnique({
      where: { id: Number(req.params.depId) },
      include: {
        project_dep: {
          include: { project: { include: { sprint: true,milestone:{
            include:{
              sprint:true
            }
          } } } }, 
        },
      },
    });

    const sprints = result.project_dep.flatMap(dep =>{
      if(dep.project.milestone.sprint){
        return dep.project.milestone.sprint
      }
       return dep.project.sprint;
      });

    res.status(200).json({
        success: true,
        data: sprints,
      });
  });