import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors'

//Import routers
import auth from "./Routers/Users/auth.js";
import allusers from "./Routers/Users/users.js";
import events from "./Routers/Events/events.js";
import michango from "./Routers/Events/contributions.js";


// Configurations
dotenv.config();
const app = express();


// CORS Configuration (Fixed Trailing Slash Issue)
const corsParameters = {
    origin: "http://localhost:2002",
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsParameters));



//SS miidleware 
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsParameters))


//routers..
app.use("/api/auth", auth);
app.use('/api/users',allusers) 
app.use('/api/events',events)
app.use('/api/contributions',michango)




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log("Database Connection Error:", err));


//listening
app.listen(process.env.PORT, ()=>{
    console.log("Live on This PORT : " + process.env.PORT)
})