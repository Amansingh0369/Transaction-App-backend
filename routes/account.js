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
    const session = await mongoose.startSession(); // Start the session

    try {
        session.startTransaction(); // Start the transaction
        const { amount, to } = req.body; // Expect 'toName' instead of 'to'

        // Find the sender's account
        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) { // Check balance property
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        // Find the recipient's account by name
        const toAccount = await Account.findOne({ name: to }).session(session); // Updated to search by name
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Account not found" });
        }

        // Update the balances within the transaction
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }, { session });
        await Account.updateOne({ userId: toAccount.userId }, { $inc: { balance: amount } }, { session }); // Use the userId of the recipient

        await session.commitTransaction(); // Commit the transaction
        res.status(200).json({ msg: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction(); // Abort on error
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession(); // End the session
    }
});

module.exports = router;