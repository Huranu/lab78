const express = require('express');
const dotenv=require('dotenv');
const errorHandler = require("./middleware/error");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

dotenv.config({path:'./config/config.env'});
const app = express();

app.use(express.json());

const store = new MongoDBStore({
  uri: "mongodb+srv://huranu:Ns6aXzU1ceqByUEC@cluster0.t2lqvfp.mongodb.net/lab5?retryWrites=true&w=majority",
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// app.use(
//   session({
//     store,
//     secret: process.env.SESSION_SECRET || 'SESSION_SECRET123',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: 'lax',
//     },
//   })
// );


// Routes
const SessionPlaceRoutes = require("./routes/places");
const JwtPlaceRoutes = require("./routes/places-jwt");
const UserRoutes = require("./routes/users");
const SessionAuthRoute = require("./routes/auth-session");
const JwtAuthRoute = require("./routes/auth-jwt");


// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);
app.use(cookieParser());

// Routes
app.use("/api/places", JwtPlaceRoutes);
app.use("/api/users", UserRoutes);
// app.use("/api/auth",SessionAuthRoute);
app.use("/api/auth",JwtAuthRoute);

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