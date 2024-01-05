import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express()

// backend request kaha kaha se aaa skta hai
app.use(cors({
    origin: process.env.CORS_ORIGIN 
}))

// data kis kis formet me aayega uska 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))


// cookies 
app.use(cookieParser);


export {app}