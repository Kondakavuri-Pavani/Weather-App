import { useState } from "react";
import axios from "axios";
import WeatherInput from "./WeatherInput";
import WeatherInfo from "./WeatherInfo";

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found or API error");
      setWeather(null);
    }
  };

  return (
    <div className="weather-container">
      <h2>Weather App</h2>
      <WeatherInput onSearch={fetchWeather} />
      <WeatherInfo weather={weather} error={error} />
    </div>
  );
};

export default WeatherDisplay;
