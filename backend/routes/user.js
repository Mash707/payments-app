const express = require("express");
const router = express.Router();
const {
  userSignUpBody,
  userSignInBody,
  updateBody,
} = require("../validation/index");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/middleware");

router.post("/signup", async function (req, res) {
  const validateUser = userSignUpBody.safeParse(req.body);
  if (!validateUser.success) {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });
  }
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });
  }

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username.toLowerCase(),
    password: req.body.password,
  });
  const userId = user._id;
  await Account.create({
    userId: userId,
    balance: Math.floor(Math.random() * 10000) + 1,
  });
  const token = jwt.sign({ userId: userId }, JWT_SECRET);
  res.status(200).json({ message: "User created successfully", token: token });
});

router.post("/signin", async function (req, res) {
  const validateUser = userSignInBody.safeParse(req.body);
  if (!validateUser.success) {
    return res.status(411).json({ message: "Error while logging in" });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (!existingUser) {
    return res.status(411).json({ message: "Error while logging in" });
  }
  const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
  return res
    .status(200)
    .json({ token: token, username: existingUser.firstName });
});

router.put("/", authMiddleware, async function (req, res) {
  const success = updateBody.safeParse(req.body).success;
  if (!success) {
    return res
      .status(411)
      .json({ message: "Error while updating information" });
  }
  await User.updateOne({ _id: req.userId }, req.body);
  return res.status(200).json({ message: "Updated successfully" });
});

router.get("/bulk", authMiddleware, async function (req, res) {
  const filter = req.query.filter || "";
  const users = await User.find({
    $and: [
      { _id: { $ne: req.userId } },
      {
        $or: [
          { firstName: { $regex: filter, $options: "i" } },
          { lastName: { $regex: filter, $options: "i" } },
        ],
      },
    ],
  });

  const formattedUsers = users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id,
  }));
  res.json({ users: formattedUsers });
});

module.exports = router;
