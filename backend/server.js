const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // add this
require("dotenv").config();

const History = require("./models/History"); // make sure filename matches exactly

const app = express();
app.use(bodyParser.json());

// Allow frontend requests
app.use(cors({
  origin: "https://unit-converter-nine-flame.vercel.app",
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("MongoDB Error:", err));

// Routes
app.get("/api/history", async (req, res) => {
  const data = await History.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post("/api/history", async (req, res) => {
  const newEntry = new History(req.body);
  await newEntry.save();
  res.json(newEntry);
});

app.delete("/api/history/:id", async (req, res) => {
  await History.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.delete("/api/history", async (req, res) => {
  await History.deleteMany();
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
