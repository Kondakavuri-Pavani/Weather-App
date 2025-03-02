import React from "react";
import WeatherDisplay from "./components/WeatherDisplay";
import "./index.css"; // Ensure styles are applied

function App() {
  return (
    <div className="App">
      <WeatherDisplay /> {/* Removed duplicate title */}
    </div>
  );
}

export default App;
