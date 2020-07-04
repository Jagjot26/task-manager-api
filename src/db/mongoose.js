const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// const me = new User({
//   name: "Jake Peralta",
//   email: "JAYSING989@GMAIL.com",
//   age: 21,
//   password: "mysecretword",
// });

// me.save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
