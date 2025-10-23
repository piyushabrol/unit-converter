const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  category: String,
  fromType: String,
  toType: String,
  fromValue: String,
  result: String,
  steps: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);
