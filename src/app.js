import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.router.js'

const app = express()

// backend request kaha kaha se aaa skta hai
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))

// data kis kis formet me aayega uska 
app.use(express.json({limit:"1500kb"}))
app.use(express.urlencoded({extended: true, limit:"200kb"}))
app.use(express.static("Public"))


// cookies 
app.use(cookieParser());

//for routing - set routing stsrting api 
app.use('/api/v1/users', userRouter)


export {app}