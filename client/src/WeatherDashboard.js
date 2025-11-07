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

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Wind */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Wind</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {weatherData.wind.speed.toFixed(1)} m/s
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg 
                className="w-5 h-5" 
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
              <span>{getWindDirection(weatherData.wind.deg)} ({weatherData.wind.deg}°)</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Humidity</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {weatherData.main.humidity}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weatherData.main.humidity}%` }}
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Visibility</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {(weatherData.visibility / 1000).toFixed(1)} km
            </div>
            <div className="text-gray-600 text-sm">
              {weatherData.visibility / 1000 >= 10 ? 'Excellent' : 
               weatherData.visibility / 1000 >= 5 ? 'Good' : 'Moderate'}
            </div>
          </div>

          
        </div>

        
        
      </div>
    </div>
  );
}