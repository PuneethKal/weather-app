import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

import {fdata, wdata} from './data.js'


dotenv.config({path:"../.env"});
const app = express();
app.use(cors());
app.use(express.json()) // Enables reading body of req

const TorontoLOC = {lat:'43.651070', lon:'-79.347015'}

// Current weather API
app.get("/api/weather", async (req, res) => {

    if(true){  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Pulling Weather Data From DB ...");
        res.json(wdata)
        return
    }

    console.log("Calling Weather API ...");
    const city = req.body.city || TorontoLOC;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OpenWeatherMapAPI}`;
    const { data } = await axios.get(url);
    res.json(data);
});

// 5 day / 3 hour forecast API
app.get("/api/forecast", async (req, res) => {

    if(true){  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Pulling Forecast Data From DB ...");
        res.json(fdata)
        return
    }

    console.log("Calling Weather API ...");
    const city = req.body.city || TorontoLOC;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OpenWeatherMapAPI}`;
    const { data } = await axios.get(url);
    res.json(data);
});

//Weather Maps (current) api

//Air Pollution api



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
