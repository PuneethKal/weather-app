import { useState } from 'react';

export default function WeatherDashboard() {
  const [weatherData] = useState({ // temp weather data
    "coord": { "lon": -79.0329, "lat": 43.8501 },
    "weather": [{ "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d" }],
    "base": "stations",
    "main": {
      "temp": 279,
      "feels_like": 275.06,
      "temp_min": 278.21,
      "temp_max": 280.77,
      "pressure": 1013,
      "humidity": 78,
      "sea_level": 1013,
      "grnd_level": 996
    },
    "visibility": 10000,
    "wind": { "speed": 6.17, "deg": 330 },
    "clouds": { "all": 75 },
    "dt": 1763054331,
    "sys": {
      "type": 2,
      "id": 2009624,
      "country": "CA",
      "sunrise": 1763035710,
      "sunset": 1763070756
    },
    "timezone": -18000,
    "id": 5882873,
    "name": "Ajax",
    "cod": 200
  });

  const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);
  const kelvinToFahrenheit = (k) => ((k - 273.15) * 9/5 + 32).toFixed(1);
  
  const [tempUnit, setTempUnit] = useState('C');
  
  const getTemp = (k) => tempUnit === 'C' ? kelvinToCelsius(k) : kelvinToFahrenheit(k);
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };

  const getWeatherGradient = (condition) => {
    const gradients = {
      'Clouds': 'from-gray-400 via-gray-500 to-gray-600',
      'Clear': 'from-blue-400 via-blue-500 to-blue-600',
      'Rain': 'from-gray-600 via-gray-700 to-gray-800',
      'Snow': 'from-blue-200 via-blue-300 to-blue-400',
    };
    return gradients[condition] || 'from-gray-400 via-gray-500 to-gray-600';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWeatherGradient(weatherData.weather[0].main)} p-4 sm:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                  {weatherData.name}, {weatherData.sys.country}
                </h1>
                <p className="text-gray-600 text-sm">
                  {weatherData.coord.lat.toFixed(4)}°, {weatherData.coord.lon.toFixed(4)}°
                </p>
              </div>
            </div>
            <button
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              °{tempUnit === 'C' ? 'F' : 'C'}
            </button>
          </div>

          {/* Main Temperature Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <div>
                <div className="text-7xl font-bold text-gray-800">
                  {getTemp(weatherData.main.temp)}°
                </div>
                <div className="text-xl text-gray-600 capitalize mt-2">
                  {weatherData.weather[0].description}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-right">
              <div className="text-gray-700">
                <span className="text-sm">Feels like</span>
                <span className="text-2xl font-semibold ml-2">
                  {getTemp(weatherData.main.feels_like)}°
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                H: {getTemp(weatherData.main.temp_max)}° L: {getTemp(weatherData.main.temp_min)}°
              </div>
            </div>
          </div>
        </div>

        

      </div>
    </div>
  );
}