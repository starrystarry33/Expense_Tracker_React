// Import necessary modules and components
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import "./Weather.scss";



function Weather() {
  // Destructure properties from global context
  const {
    weather,
    weatherForecast,
    getWeather,
    getWeatherForecast,
  } = useGlobalContext();
  const [selectedCity, setSelectedCity] = useState("Boston");

// Fetch weather data when the selected city changes
useEffect(() => {
    getWeather(selectedCity);
    getWeatherForecast(selectedCity);
  }, [selectedCity, getWeather, getWeatherForecast]);

  // Function to handle city selection change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };
  // Display loading message if weather data is not available
  if (!weather || !weatherForecast) {
    return <p>Loading...</p>;
  }

  console.log("Weather Forecast Prop:", weatherForecast);
  console.log("Weather Data:", weather);
  console.log("Weather Forecast Data:", weatherForecast);

  // Render the Weather component
  return (
    <div className="weather-main">
      <InnerLayout>
        <h1>WEATHER</h1>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="Boston">Boston</option>
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>
        <h2 className="weather-intro">
          Current Weather: <span>{weather.name}</span>
        </h2>
        <div className="weather-content">
          {weather.weather && (
            <div>
              <p>Weather: {weather.weather[0].main}</p>
              <p>Description: {weather.weather[0].description}</p>
            </div>
          )}
          {weather.main && (
            <div>
              <p>
                Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C
              </p>
              <p>
                Feels Like: {(weather.main.feels_like - 273.15).toFixed(2)} °C
              </p>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
          )}
        </div>
        <div className="weather-forecast">
          {weatherForecast &&
            weatherForecast.list &&
            weatherForecast.list.map((forecast, index) => (
              <div key={index} className="forecast-item">
                <h3>{new Date(forecast.dt * 1000).toLocaleString()}</h3>
                <p>Weather: {forecast.weather[0].main}</p>
                <p>Description: {forecast.weather[0].description}</p>
                <p>
                  Temperature: {(forecast.main.temp - 273.15).toFixed(2)} °C
                </p>
                <p>Humidity: {forecast.main.humidity}%</p>
                <p>Wind Speed: {forecast.wind.speed} m/s</p>
                <p>Wind Direction: {forecast.wind.deg}°</p>
              </div>
            ))}
        </div>
      </InnerLayout>
    </div>
  );
  
  
}

// Export Weather component
export default Weather;

