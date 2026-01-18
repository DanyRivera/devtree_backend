import express from "express";
import router from "./router";  
import { connectDB } from "./config/db";
import 'dotenv/config'

const app = express();
connectDB();

//Enable Read data from forms
app.use(express.json());

//Agregar Router
app.use('/', router);

export default app;