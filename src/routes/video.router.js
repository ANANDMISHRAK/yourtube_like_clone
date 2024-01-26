import  express  from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";


const router = express()

// publish or uploac video
router.route('/upload-video').post(verifyJWT,
                                   upload.fields(
                                                  [
                                                    {
                                                        name : "videoFile",
                                                        maxCount: 1
                                                    },
                                                    {
                                                        name : "thumbNail",
                                                        maxCount: 1
                                                    }
                                                  ]
                                                ) ,
                                   publishAVideo)

//get single video accoring to video id get from url
router.route('/:videoId').get(getVideoById)

//update video
router.route('/update-video/:videoId').patch(verifyJWT, upload.single("thumbnail"),updateVideo )

// video delete
router.route('/delete-video/:videoId').delete(verifyJWT, deleteVideo)

// toggel video status
router.route('/toggle-video/:videoId').patch(verifyJWT,togglePublishStatus )


//get all video 
router.route('/').get(getAllVideos)


export default router