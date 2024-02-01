import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { 
    getAllLikeOfVideo,
    toggleCommentLike,
         toggleTweetLike,
         toggleVideoLike ,

        } from '../controllers/like.controller.js'
const router = express.Router()

// toggle video like
router.route('/toggle-video-like/:videoId').get(verifyJWT, toggleVideoLike)

// toggle comment like
router.route('/toggle-comment-like/:commentId').get(verifyJWT, toggleCommentLike);

// toggle tweet like
router.route('/toggle-tweet-like/:tweetId').get(verifyJWT, toggleTweetLike)

// get video all like
router.route('/get-all-like/:videoId').get(verifyJWT, getAllLikeOfVideo)


export default router