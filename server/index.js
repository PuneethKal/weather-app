import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

import { fdata, wdata } from './data.js'


dotenv.config({ path: "../.env" });
const app = express();
app.use(cors());
app.use(express.json()) // Enables reading body of req

const timeOffset = 3600 //1hr time in epoch time
let currentWeatherData = '';
let currentForecastData = '';

function formatForecastData(forecasts, tzoffset) {
    let cols = []
    let rows = []

    forecasts.forEach((forecast, index) => {

        if (index == 0) {
            rows.push(forecast)
        } else {

            const firstDate = new Date((rows[0].dt + tzoffset) * 1000).getUTCDate();
            const currentDate = new Date((forecast.dt + tzoffset) * 1000).getUTCDate();

            if (currentDate == firstDate) {
                rows.push(forecast)
            } else {
                cols.push([...rows])
                rows = [forecast]
            }

            if (index === forecasts.length - 1) {
                cols.push([...rows]);
            }
        }
    });

    return cols
}

function checkSimilar(dt,prev_lat, prev_lon, lat, lon){
    if (((dt + timeOffset)*1000 > Date.now()) && (prev_lat == Number(lat.toFixed(4)) && prev_lon== Number(lon.toFixed(4)) ) ){
        return true;
    }
    return false;
}

// Current weather API
app.get("/api/weather", async (req, res) => {

    const lat = parseFloat(req.query.lat) || '43.651070';
    const lon = parseFloat(req.query.lon) || '-79.347015';
    if (currentWeatherData && checkSimilar(currentWeatherData.dt,currentWeatherData.coord.lat,currentWeatherData.coord.lon,lat,lon) ) {
        console.log("Using Stored Weather");
        res.json(currentWeatherData)
    } else {
        console.log("Calling Weather API ...");
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OpenWeatherMapAPI}`;
        const { data } = await axios.get(url);
        currentWeatherData = data;
        res.json(data);
    }

});

// 5 day / 3 hour forecast API
app.get("/api/forecast", async (req, res) => {

    const lat = parseFloat(req.query.lat) || '43.651070';
    const lon = parseFloat(req.query.lon) || '-79.347015';
    if (currentForecastData && checkSimilar(currentForecastData.list[0][0].dt,currentForecastData.city.coord.lat,currentForecastData.city.coord.lon,lat,lon) ) {  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Using Stored Forecast");
        res.json(currentForecastData.list)
    } else {
        console.log("Calling Forecast API ...");
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OpenWeatherMapAPI}`;
        const { data } = await axios.get(url);
        currentForecastData = data
        currentForecastData['list'] = formatForecastData(data.list, data.city.timezone)
        res.json(currentForecastData.list);
    }
});

//TODO: Add Weather Map API (future)



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
