// export default Weatherc;
import React, { useState, useEffect } from "react";

import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiDayFog,
  WiNightFog,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
  WiThermometer,
} from "react-icons/wi";
import { FaSearch, FaLocationArrow } from "react-icons/fa";

const Weatherc = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [location, setLocation] = useState({ lat: 51.5074, lon: -0.1278 }); // Default to London

  // Replace this with your actual API key from OpenWeatherMap

  const API_KEY = import.meta.env.VITE_WHEATHERAPI_KEY;

  // Default data for current weather
  const defaultCurrentData = {
    name: "London",
    sys: { country: "GB" },
    main: {
      temp: 15,
      feels_like: 14,
      humidity: 76,
      pressure: 1012,
    },
    weather: [
      {
        id: 803,
        icon: "04d",
        description: "cloudy",
      },
    ],
    wind: {
      speed: 4.5,
    },
  };

  // Default data for forecast
  const defaultForecastData = {
    list: [
      {
        dt: Date.now() / 1000 + 86400,
        main: { temp: 16, humidity: 75 },
        weather: [{ id: 802, icon: "03d", description: "scattered clouds" }],
        wind: { speed: 4.2 },
      },
      {
        dt: Date.now() / 1000 + 86400 * 2,
        main: { temp: 18, humidity: 70 },
        weather: [{ id: 801, icon: "02d", description: "few clouds" }],
        wind: { speed: 3.8 },
      },
      {
        dt: Date.now() / 1000 + 86400 * 3,
        main: { temp: 17, humidity: 72 },
        weather: [{ id: 500, icon: "10d", description: "light rain" }],
        wind: { speed: 5.1 },
      },
      {
        dt: Date.now() / 1000 + 86400 * 4,
        main: { temp: 14, humidity: 80 },
        weather: [{ id: 521, icon: "09d", description: "shower rain" }],
        wind: { speed: 6.3 },
      },
      {
        dt: Date.now() / 1000 + 86400 * 5,
        main: { temp: 13, humidity: 82 },
        weather: [{ id: 501, icon: "10d", description: "moderate rain" }],
        wind: { speed: 5.8 },
      },
    ],
  };

  // Get user's location on initial load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeatherByCoords(latitude, longitude);
          setGettingLocation(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError(
            "Unable to get your location. Please search for a city instead."
          );
          setCity("Gujarat"); // Fallback to default city
          setGettingLocation(false);
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please search for a city instead."
      );
      setCity("Gujarat"); // Fallback to default city
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);

      // Fetch current weather by coordinates
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error("Weather data not available for your location");
      }

      const currentData = await currentResponse.json();

      // Fetch 5-day forecast by coordinates
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available for your location");
      }

      const forecastData = await forecastResponse.json();

      // Process forecast data
      const processedForecast = {
        list: forecastData.list
          .filter((item, index) => index % 8 === 0)
          .slice(0, 5),
      };

      setWeatherData(currentData);
      setForecastData(processedForecast);
      setCity(currentData.name); // Update city name based on coordinates
      setError(null);
    } catch (err) {
      setError(err.message);
      if (!weatherData) setWeatherData(defaultCurrentData);
      if (!forecastData) setForecastData(defaultForecastData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);

      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error("City not found or API error");
      }

      const currentData = await currentResponse.json();

      // Update location coordinates for the Windy map
      setLocation({ lat: currentData.coord.lat, lon: currentData.coord.lon });

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available for this city");
      }

      const forecastData = await forecastResponse.json();

      // Process forecast data
      const processedForecast = {
        list: forecastData.list
          .filter((item, index) => index % 8 === 0)
          .slice(0, 5),
      };

      setWeatherData(currentData);
      setForecastData(processedForecast);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Don't clear weather data on error to keep displaying previous results
      if (!weatherData) setWeatherData(defaultCurrentData);
      if (!forecastData) setForecastData(defaultForecastData);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch weather when city changes
  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city);
    } else {
      // Initialize with default data if no city and no weather data yet
      if (!weatherData) setWeatherData(defaultCurrentData);
      if (!forecastData) setForecastData(defaultForecastData);
    }
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      setSearchInput("");
    }
  };

  const handleGetCurrentLocation = () => {
    getUserLocation();
  };

  // Map OpenWeatherMap icon codes to React Icons
  const getWeatherIcon = (iconCode, weatherId) => {
    const iconSize = 48;
    const isNight = iconCode.includes("n");

    // Map weather condition codes to appropriate React Icons
    if (weatherId >= 200 && weatherId < 300) {
      return <WiThunderstorm size={iconSize} className="text-gray-700" />;
    } else if (weatherId >= 300 && weatherId < 400) {
      return <WiShowers size={iconSize} className="text-blue-400" />;
    } else if (weatherId >= 500 && weatherId < 600) {
      return <WiRain size={iconSize} className="text-blue-500" />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <WiSnow size={iconSize} className="text-blue-200" />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return isNight ? (
        <WiNightFog size={iconSize} className="text-gray-500" />
      ) : (
        <WiDayFog size={iconSize} className="text-gray-500" />
      );
    } else if (weatherId === 800) {
      return isNight ? (
        <WiNightClear size={iconSize} className="text-yellow-300" />
      ) : (
        <WiDaySunny size={iconSize} className="text-yellow-500" />
      );
    } else if (weatherId === 801) {
      return isNight ? (
        <WiNightAltCloudy size={iconSize} className="text-gray-400" />
      ) : (
        <WiDayCloudy size={iconSize} className="text-gray-400" />
      );
    } else if (weatherId === 802) {
      return <WiCloud size={iconSize} className="text-gray-500" />;
    } else {
      return <WiCloudy size={iconSize} className="text-gray-600" />;
    }
  };

  // Format date
  const formatDate = (timestamp = null) => {
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="w-full h-full mx-auto bg-gradient-to-br from-emerald-50 via-green-100 to-lime-100
 rounded-xl shadow-lg overflow-hidden border border-green-100"
    >
      <div className="p-1 sm:p-6">
        {/* Search Bar */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="flex flex-grow">
            <input
              type="text"
              placeholder="Enter city name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="City search"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-300 flex items-center justify-center"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
          <button
            onClick={handleGetCurrentLocation}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center"
            disabled={gettingLocation}
          >
            <FaLocationArrow className="mr-2" />
            {gettingLocation ? "Getting Location..." : "Use My Location"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-2">
            <div className="text-gray-500">Loading latest weather data...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
            <p className="text-sm">
              Showing default or last successful data. Please check the city
              name and try again.
            </p>
          </div>
        )}

        {/* Current Weather */}
        {weatherData && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {weatherData.name}, {weatherData.sys.country}
                </h2>
                <p className="text-gray-500 mt-1">{formatDate()}</p>
              </div>

              <div className="flex items-center">
                <div className="mr-2">
                  {getWeatherIcon(
                    weatherData.weather[0].icon,
                    weatherData.weather[0].id
                  )}
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-bold text-gray-800">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                  <p className="text-lg sm:text-xl text-gray-600 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm flex items-center">
                <WiThermometer size={28} className="text-red-500 mr-2" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Feels Like</p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {Math.round(weatherData.main.feels_like)}°C
                  </p>
                </div>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm flex items-center">
                <WiHumidity size={28} className="text-blue-500 mr-2" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Humidity</p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {weatherData.main.humidity}%
                  </p>
                </div>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm flex items-center">
                <WiStrongWind size={28} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Wind Speed</p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {Math.round(weatherData.wind.speed)} m/s
                  </p>
                </div>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm flex items-center">
                <WiBarometer size={28} className="text-purple-500 mr-2" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Pressure</p>
                  <p className="text-lg sm:text-xl font-semibold">
                    {weatherData.main.pressure} hPa
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Windy Map Integration */}
        <div className="mt-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Interactive Weather Map
          </h3>
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden shadow-md">
            <iframe
              className="w-full h-full"
              src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=°C&metricWind=default&zoom=6&overlay=rain&product=ecmwf&level=surface&lat=${location.lat}&lon=${location.lon}&detailLat=${location.lat}&detailLon=${location.lon}&marker=true&message=true`}
              frameBorder="0"
              title="Windy Weather Map"
            ></iframe>
          </div>
        </div>

        {/* 5-Day Forecast */}
        {forecastData && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {forecastData.list.map((day, index) => (
                <div
                  key={index}
                  className="p-3 bg-white bg-opacity-70 rounded-lg shadow-sm hover:shadow transition-shadow"
                >
                  <p className="text-center font-medium mb-2">
                    {formatDate(day.dt)}
                  </p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.weather[0].icon, day.weather[0].id)}
                  </div>
                  <p className="text-center font-bold text-lg">
                    {Math.round(day.main.temp)}°C
                  </p>
                  <p className="text-center text-xs text-gray-600 capitalize truncate">
                    {day.weather[0].description}
                  </p>
                  <div className="mt-2 flex flex-col text-xs text-gray-600">
                    <div className="flex items-center justify-center">
                      <WiHumidity size={16} className="mr-1 text-blue-400" />
                      <span>{day.main.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <WiStrongWind size={16} className="mr-1 text-gray-400" />
                      <span>{Math.round(day.wind.speed)} m/s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weatherc;
