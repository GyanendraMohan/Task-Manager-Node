const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
//fetch all the tasks
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  const length = tasks.length;
  // res.status(200).json({ length, tasks: tasks });
  res
    .status(200)
    .json({ status: "success", data: { tasks, nbHIts: tasks.length } });
});

//create the tasks
const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

//fetch the task with ID
const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
    // return res.status(404).json({ msg: `No task with id : ${taskID}` });
  }

  res.status(200).json({ task });
});

//delete the task
const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    // return res.status(404).json({ msg: `No task with id : ${taskID}` });
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  //   res.status(200).json({ task });
  //    res.status(200).send();
  res.status(200).json({ task: null, status: "success" });
});

//update the task
const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    // return res.status(404).json({ msg: `No task with id : ${taskID}` });
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
