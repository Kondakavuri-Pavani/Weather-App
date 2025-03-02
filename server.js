require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

const API_KEY = "b79197acb86622c3c09c75ca9841d256";  // Directly set API key
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Weather Schema and Model
const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    description: String,
    country: String,
    date: { type: Date, default: Date.now }
});

const Weather = mongoose.model("Weather", weatherSchema);
console.log("Loaded API Key:", process.env.WEATHER_API_KEY);
// Fetch weather and save to MongoDB
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City parameter is required" });
    }

    try {
        // Check if recent weather data exists in DB (last 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        let existingWeather = await Weather.findOne({ city, date: { $gte: oneHourAgo } });

        if (existingWeather) {
            return res.json(existingWeather);
        }

        // Fetch weather data from API
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        // Save new weather data to MongoDB
        const newWeather = new Weather({
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            country: response.data.sys.country
        });

        await newWeather.save();
        res.json(newWeather);

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.status(404).json({ error: "City not found or API error" });
    }
});

// Fetch all saved weather records
app.get("/api/saved-weather", async (req, res) => {
    try {
        const records = await Weather.find().sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
