const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const { Mongoose } = require("mongoose");
const { ObjectID } = require("mongodb");

const app = express();

const port = process.env.PORT;

//express middleware
//request -> middleware -> route handlers
// app.use((req, res, next) => {
//   res.status(503).send({ "Error 503": "The site is under maintenance" });
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//USERS

//TASKS

app.listen(port, () => {
  console.log("Running on port " + port);
});
