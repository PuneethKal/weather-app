import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path:"../.env"});
const app = express();
app.use(cors());


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
