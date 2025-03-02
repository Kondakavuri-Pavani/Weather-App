const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperature: Number,
  description: String,
  country: String,
  date: { type: Date, default: Date.now },
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
