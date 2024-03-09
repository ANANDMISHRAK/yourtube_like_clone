import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addComment,
         deleteComment,
         getComment,
         updateComment 

       }  
       from '../controllers/comment.controller.js'

const router = express.Router()
// add or create comment
router.route('/add/:videoId').post(verifyJWT, addComment)

// update comment
router.route('/update/:commentId').patch(verifyJWT, updateComment)

// delete comment
router.route('/delete/:commentId').delete(verifyJWT, deleteComment)

// get all comment in a video
router.route('/all-comment/:videoId').get(getComment)

export default  router