const express = require("express");
const axios = require("axios");
const Weather = require("../models/weatherModel");
require("dotenv").config();

const router = express.Router();
const API_KEY = process.env.WEATHER_API_KEY;

console.log("API Key:", process.env.WEATHER_API_KEY);
// Fetch weather and save to MongoDB
router.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    // Check if weather data is already stored
    let existingWeather = await Weather.findOne({ city }).sort({ date: -1 });
    
    if (existingWeather) {
      return res.json(existingWeather);
    }

    // Fetch new weather data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const newWeather = new Weather({
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      country: response.data.sys.country,
    });

    await newWeather.save();
    res.json(newWeather);
  } catch (error) {
    res.status(500).json({ error: "City not found or API error" });
  }
});

// Fetch all saved weather records
router.get("/saved-weather", async (req, res) => {
  try {
    const records = await Weather.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
