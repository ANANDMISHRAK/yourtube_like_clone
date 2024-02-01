import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {
         getSubscribeChannel,
         getUserChannelSubscriber,
         toggleSubscription
      
       } from '../controllers/subscription.controller.js'

const router = express.Router()

// toggle subscribtion -> subscriber or un subscribe
router.route('/toggle-subscription/:channelId').get(verifyJWT, toggleSubscription)

// count subscriber
router.route('/subscriber/:channelId').get(verifyJWT,getUserChannelSubscriber )

// user how namy channel subscribed
router.route('/subscribe/:userId').get(verifyJWT, getSubscribeChannel)


export default router