const express = require("express");
const zod = require("zod");
const { User,Account } = require("../db");
const authMiddleware = require("../middleware"); // fixed import
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config"); // fixed import
const router = express.Router();

const userSchema = zod.object({
    name: zod.string().min(1, "Name is required"),
    email: zod.string().email("Invalid email"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
});


router.post("/signup", async function (req, res) {
        const body = req.body;
        const { success } = userSchema.safeParse(body);
        if (!success) {
            return res.status(401).json({ msg: "Input is Wrong kindly check the input" });
        }

        const user = await User.findOne({ email: body.email });
        if (user) {
            return res.status(401).json({ msg: "Email is already taken" });
        }

        const dbUser = await User.create(body);

        const userId = dbUser._id;

        const token = jwt.sign({ userId: dbUser._id }, JWT_SECRET);

        await Account.create({
            name:req.body.name,
            userId,
            balance: 1 + Math.random() *10000
        })

        res.status(200).json({ msg: "User Created Successfully", token });

});

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
});

router.post("/login", async function (req, res) {
    try {
        const body = req.body
        const { success } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ msg: "Input is Wrong" });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user.email !== req.body.email) {
            return res.status(401).json({ msg: "Invalid Email" });
        }
        if (user.password !== req.body.password) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(200).json({ msg: "Login Successfully", token, email : body.email });
    } catch (error) {
        res.status(500).json({ msg: "An error occurred during Login", error: error.message });
    }
});


const updateSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { success } = updateSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Inputs"
            });
        }

        const result = await User.updateOne(
            { _id: req.userId }, // Filter to find the document by userId
            { $set: req.body }    // Update with new data
        );

        if (result.nModified === 0) {
            return res.status(404).json({
                message: "User not found or no changes made"
            });
        }

        res.json({
            message: "Updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating",
            error: error.message
        });
    }
});

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";

        const users = await User.find({
            $or: [
                {
                    name: {
                        "$regex": filter,
                        "$options": "i" // Case-insensitive matching
                    }
                }
            ]
        });

        res.json({
            users: users.map(user => ({
                name: user.name,
                email: user.email,
                _id: user._id
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
});

module.exports = router;
