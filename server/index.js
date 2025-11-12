import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

const wdata = {
    "coord": {
        "lon": -79.0329,
        "lat": 43.8501
    },
    "weather": [
        {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04d"
        }
    ],
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
    "wind": {
        "speed": 6.17,
        "deg": 330
    },
    "clouds": {
        "all": 75
    },
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
}

dotenv.config({path:"../.env"});
const app = express();
app.use(cors());
app.use(express.json()) // Enables reading body of req

const TorontoLOC = {lat:'43.651070', lon:'-79.347015'}

// Current weather API
app.get("/api/weather", async (req, res) => {

    if(true){  // TODO: Intended to full from DB when time difference between API req is small
        console.log("Pulling From DB ...");
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
