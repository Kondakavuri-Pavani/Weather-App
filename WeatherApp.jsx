import React from "react";
import WeatherDisplay from "./components/WeatherDisplay"; // Ensure the correct path
import "./WeatherApp.css"; // Ensure this file exists

function WeatherApp() {
  return (
    <div className="App">
      <WeatherDisplay />
    </div>
  );
}

export default WeatherApp;
