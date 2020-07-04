require("../src/db/mongoose");

const User = require("../src/models/user");

User.findByIdAndUpdate("5efb95dc27121102f2e25baa", { age: 1 })
  .then((res) => {
    console.log(res);

    return User.countDocuments({ age: 1 });
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
