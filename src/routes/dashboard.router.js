import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getChannelStats, getChannelVideo } from '../controllers/dashboard.conreoller.js'

const router = express.Router()

// 
router.route('/status').get(verifyJWT, getChannelStats)

//
router.route('/videos').get(verifyJWT, getChannelVideo)



export default router