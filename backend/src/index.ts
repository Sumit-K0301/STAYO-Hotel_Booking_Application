import connectDB from "./db/db";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary"

import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser"

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import hotelRoutes from "./routes/hotels";
import searchHotelRoutes from "./routes/searchHotel"
import bookingRoutes from "./routes/bookings"


connectDB()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/my-hotels", hotelRoutes)
app.use("/api/hotels", searchHotelRoutes)
app.use("/api/my-bookings", bookingRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Application is listening at port ${process.env.PORT}`)
})