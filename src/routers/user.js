const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendSayonaraEmail } = require("../emails/account");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); //this is done here just to stay more explicit and it doesn't throw an error without a token because while token is 'required' if an object is there in the array, but that doesn't mean the array can't be empty
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//COMMENTED CODE FOR GETTING /users/:id because we don't need it but it's still there for future reference.
// router.get("/users/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     if (_id.length != 12 && _id.length != 24) {
//       return res.status(404).send({ error: "The given user was not found!" });
//     }

//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }

//   the same stuff but with promise chaining
//     const _id = req.params.id;

//     User.findById(_id)
//       .then((user) => {
//         if (!user) {
//           return res.status(404).send();
//         }
//         res.send(user);
//       })
//       .catch((err) => {
//         res.status(500).send();
//       });
// });

router.patch("/users/me", auth, async (req, res) => {
  const props = Object.keys(req.body);
  const validProps = ["name", "age", "email", "password"];
  const validRequest = props.every((prop) => {
    return validProps.includes(prop);
  });

  if (!validRequest) {
    res.status(400).send({ Error: "Invalid properties specified" });
  }

  try {
    props.forEach((update) => {
      req.user[update] = req.body[update]; //cant do req.user.update = req.body.update because wrong syntax as we don't know the property value
    });

    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   runValidators: true,
    //   new: true,
    // });

    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   res.status(404).send({ Error: "Specified user not found" });
    // }

    await req.user.remove();
    sendSayonaraEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//multer middleware
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    //$ means string should end with stuff mentioned before the $
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only images with the extensions (.jpg, .jpeg, .png) are supported"), undefined);
    }
    cb(undefined, true);
  },
});

//setting profile pic
router.post(
  "/users/me/avatar", //route
  auth, //auth middleware
  upload.single("avatar"), //multer middleware invoked
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//deleting profile pic
router.delete("/users/me/avatar", auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(400).send({ error: "Profile pic doesn't exist" });
  }
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//getting profile pic for a user by id
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
