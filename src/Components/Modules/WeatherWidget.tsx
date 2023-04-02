import React, { useState, useEffect } from "react";

interface WeatherWidgetProps {
  location: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://weatherwidget.io/js/widget.min.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="item" id="weather">
      <h2 className="header">
        Weather
      </h2>
      <a
        className="weatherwidget-io"
        href={`https://forecast7.com/en/${location}/?unit=us`}
        /* data-label_1={location.toUpperCase()} */
        /* data-label_2="WEATHER" */
        data-theme="dark"
        data-basecolor=""
        data-accent=""
        /* data-mode="Forecast" */
      >
        {location.toUpperCase()} WEATHER
      </a>
    </div>
  );
};

export default WeatherWidget;

