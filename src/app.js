import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.router.js'
import videoRouter from './routes/video.router.js'
import platlistRouter from './routes/playlist.router.js'
import commentRouter from './routes/comment.router.js'

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
app.use('/api/v1/video', videoRouter)
app.use('api/v1/playlist', platlistRouter)
app.use('api/v1/comment', commentRouter)


export {app}