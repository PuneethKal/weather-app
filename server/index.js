import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path:"../.env"});
const app = express();
app.use(cors());
app.use(express.json()) // Enables reading body of req

app.get("/api/weather", async (req, res) => {
    console.log("Calling Weather API ...");
    const TorontoLOC = {lat:'43.651070', lon:'-79.347015'}
    const city = req.body.city || TorontoLOC; // city should be json with lat and lon 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OpenWeatherMapAPI}`;
    const { data } = await axios.get(url);
    res.json(data);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
