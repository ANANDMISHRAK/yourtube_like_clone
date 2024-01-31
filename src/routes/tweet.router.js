import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addTweet,
       deleteTweet, 
       getTweet, 
       updateTweet 
      } from '../controllers/tweet.controller.js'

const router= express.Router()

// creeate tweet
router.route('/').post(verifyJWT, addTweet)

//update tweet
router.route('/update/:tweetId').patch(verifyJWT, updateTweet)

//delete tweet
 router.route('/delete/:tweetId').delete(verifyJWT, deleteTweet)

 //get all tweets of user
 router.route('/all-tweet/:userId').get(verifyJWT, getTweet)


export default router