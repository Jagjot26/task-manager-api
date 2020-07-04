require("../src/db/mongoose");

const Task = require("../src/models/task");

// Task.findByIdAndDelete("5efa49ffe0799420c0fdccfe")
//   .then((res) => {
//     console.log(res);

//     return Task.count({ completed: false });
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const deleteAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const numOfIncomplete = await Task.countDocuments({ completed: false });
  return numOfIncomplete;
};

deleteAndCount("5efb9943d74d16034c0e669c")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
