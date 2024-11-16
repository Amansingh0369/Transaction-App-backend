const express = require("express")
const router = express.Router();
const {Account} = require("../db")
const authMiddleware = require("../middleware");
const mongoose = require("mongoose");

router.get("/balance",authMiddleware,async (req,res)=>{
    try{
        const account = await Account.findOne({
            userId:req.userId,
        });

        res.status(200).json({
            balance: account.balance
        })
    }catch (e){
        res.json(e);
    }
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId : to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Account not found" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }, { session });
        await Account.updateOne({ userId: toAccount.userId }, { $inc: { balance: amount } }, { session });

        await session.commitTransaction();
        res.status(200).json({ msg: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;