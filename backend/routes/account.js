const express = require("express");
const router = express.Router();
const { Account } = require("../db");
const { authMiddleware } = require("../middleware/middleware");

router.get("/balance", authMiddleware, async function (req, res) {
  const user = await Account.findOne({ userId: req.userId });
  res.status(200).json({ balance: user.balance });
});

router.post("/transfer", authMiddleware, async function (req, res) {
  const session = await Account.startSession();
  session.startTransaction();
  const toAccount = await Account.findOne({ userId: req.body.to }).session(
    session
  );
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({ message: "Invalid account" });
  }
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (account.balance < req.body.amount) {
    await session.abortTransaction();
    return res.status(400).json({ message: "Insufficient balance" });
  }
  try {
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -req.body.amount } }
    ).session(session);
    await Account.updateOne(
      { userId: toAccount.userId },
      { $inc: { balance: +req.body.amount } }
    ).session(session);
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "Transaction successfull" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Transaction failed" });
  }
});

module.exports = router;
