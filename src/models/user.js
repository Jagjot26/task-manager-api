const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Email is invalid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(val) {
        if (val < 0) {
          throw new Error("Age can't be less than zero");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(val) {
        if (val.toLowerCase().includes("password")) {
          throw new Error("Password can't contain 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//foreign field is name of the field on the other schema(i.e. tasks) in the relationship.
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//res.send calls JSON.stringify behind the scenes on the user instance. Now, when JSON.stringify is called on an object that has a toJSON method defined, toJSON runs first and changes are made to the object before it's converted to JSON format. Here, we used a copy of the user instance as we didn't want to delete props from the original user instance
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;
  return userObj;
};

//.methods is used for methods which are perfomed on instances of schemas. Here, we can't use arrow functions because arrow functions don't bind 'this' and we need 'this'
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//.statics is used for methods which are to be performed on models/schemas i.e. User in this case
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Unable to login");
  }

  return user;
};

//this is called before user.save() every time to check whether the password has been changed and if so, it hashes the new password. It also works in the case when there's no password saved, i.e. first time signing up
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  console.log("Just before saving");
  next();
});

//delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema); //we use the name here i.e. User to define relationships b/w schemas

module.exports = User;
