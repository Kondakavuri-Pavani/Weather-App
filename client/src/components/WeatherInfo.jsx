const WeatherInfo = ({ weather, error }) => {
    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }
  
    if (!weather) {
      return <p>Enter a city to get weather details.</p>;
    }
  
    return (
      <div>
        <h3>{weather.city}</h3>
        <p>Temperature: {weather.temperature}°C</p>
        <p>Condition: {weather.condition}</p>
      </div>
    );
  };
  
  export default WeatherInfo;
  