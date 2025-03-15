const express = require("express");
const mongoose = require("mongoose");
const questionnaireRoutes = require("./routes/questionnaireRoutes");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/questionnaires", questionnaireRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

app.listen(5000, () => console.log("Server running on port 5000"));
