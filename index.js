const express = require('express');
const dotenv=require('dotenv');
const errorHandler = require("./middleware/error");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config({path:'./config/config.env'});
const app = express();

// Routes
const DepRoutes = require("./routes/departments");
const ProjectRoutes = require("./routes/projects");
const MileRoutes = require("./routes/milestones");
const SprintRoutes = require("./routes/sprints");
const TaskRoutes = require("./routes/tasks");
const UserRoutes = require("./routes/users");
const TagRoutes = require("./routes/tags");
const LoginRoute = require("./routes/login");
const RegisterRoute = require("./routes/register");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Routes
app.use("/department", DepRoutes);
app.use("/project", ProjectRoutes);
app.use("/milestone", MileRoutes);
app.use("/sprint", SprintRoutes);
app.use("/task", TaskRoutes);
app.use("/user", UserRoutes);
app.use("/tag", TagRoutes);
app.use("/login", LoginRoute);
app.use("/register", RegisterRoute);


app.listen(process.env.PORT,"0.0.0.0",()=>{
  console.log(`server started on ${process.env.PORT} PORT🔥`);
});

app.use(errorHandler);

process.on("unhandledRejection", (err, promise) => {
    console.log("error " + err.message);
    server.close(() => {
      process.exit(1);
    });
  });