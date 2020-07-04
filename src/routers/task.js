const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");
const e = require("express");

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const validProps = ["description", "completed", "createdAt", "updatedAt"];
    const validOrders = ["asc", "desc"];

    const sortProp = req.query.sortBy.split(":")[0];
    let order = req.query.sortBy.split(":")[1];
    if (!order) {
      order = "asc";
    }

    if (!validProps.includes(sortProp) || !validOrders.includes(order)) {
      return res.status(400).send({ Error: "Invalid request" });
    }

    sort[sortProp] = order;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    //we can also do : const tasks = await Task.find({owner : req.user._id})
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  if (_id.length != 12 && _id.length != 24) {
    return res.status(404).send({ error: "task not found" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const props = Object.keys(req.body);
  const validProps = ["description", "completed"];
  const isValidReq = props.every((prop) => {
    return validProps.includes(prop);
  });

  if (!isValidReq) {
    res.status(400).send({ Error: "Invalid request" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ Error: "Specified task was not found" });
    }

    props.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   runValidators: true,
    //   new: true,
    // });

    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send({ Error: "Specified task not found" });
    }

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
