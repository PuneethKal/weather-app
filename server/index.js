import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

import {fdata, wdata} from './data.js'


dotenv.config({path:"../.env"});
const app = express();
app.use(cors());
app.use(express.json()) // Enables reading body of req

const timeOffset = 3600 //1hr time in epoch time
let currentWeatherData = '';
let currentForecastData = '';

function formatForecastData(forecasts){
    let cols = []
    let rows = []
    
    forecasts.forEach((forecast,index) => {
        const currentDate = new Date(forecast.dt * 1000).toDateString();

        if(index == 0){
            rows.push(forecast)
        }else{
            
            const firstDate = new Date(rows[0].dt * 1000).toDateString();
            const currentDate = new Date(forecast.dt * 1000).toDateString();

            if (currentDate == firstDate){
                rows.push(forecast)
            }else{
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

// Current weather API
app.get("/api/weather", async (req, res) => {

    const currentDate = Date.now()
    if(currentWeatherData || (currentWeatherData.dt + timeOffset > currentDate) ){  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Using Stored Weather");
        res.json(currentWeatherData)
    }else{
        const lat = req.query.lat || '43.651070';
        const lon = req.query.lon || '-79.347015';

        console.log("Calling Weather API ...");
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OpenWeatherMapAPI}`;
        const { data } = await axios.get(url);
        currentWeatherData = data;
        res.json(data);
    }
    
});

// 5 day / 3 hour forecast API
app.get("/api/forecast", async (req, res) => {

    const currentDate = Date.now()
    if(currentForecastData || (currentForecastData.dt + timeOffset > currentDate) ){  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Using Stored Forecast");
        res.json(currentForecastData)
    }else{
        const lat = req.query.lat || '43.651070';
        const lon = req.query.lon || '-79.347015';

        console.log("Calling Forecast API ...");
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OpenWeatherMapAPI}`;
        const { data } = await axios.get(url);
        currentForecastData = formatForecastData(data.list)
        res.json(currentForecastData);
    }
});

//Weather Maps (current) api

//Air Pollution api



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
