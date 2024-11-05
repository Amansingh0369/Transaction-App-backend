const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = require('./routes/index');

app.use("/api/vi", mainRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});