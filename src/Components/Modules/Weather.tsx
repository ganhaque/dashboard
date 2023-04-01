import React, { useEffect, useState } from "react";

const WeatherDisplay = () => {
  const [weather, setWeather] = useState("");

  useEffect(() => {
    const fetchWeather = () => {
      fetch("https://wttr.in/?format=1")
        .then((response) => response.text())
        .then((data) => setWeather(data))
        .catch((error) => console.error(error));
    };

    fetchWeather();

    // update every hour
    const interval = setInterval(fetchWeather, 360000);

    return () => clearInterval(interval);
  }, []);

  return <div className="item" id="weather">{weather}</div>;
};

export default WeatherDisplay;

