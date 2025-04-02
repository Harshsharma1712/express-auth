import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express()

const port = process.env.PORT || 3000;

// connect to DB
connectDB();

// middleware
app.use(express.json());


// routes
app.use('/api/auth', authRoutes)



app.get("/", (req, res) => {
    res.send("This is authentaction Server.");
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})