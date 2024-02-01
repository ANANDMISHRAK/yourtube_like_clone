import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

// toggele video like
const toggleVideoLike = asyncHandler(async(req, res)=>{
    try{
         // take video if from url
         const {videoId}= req.params 
         if(!videoId)
         {
            throw new ApiError(401, "Video Id must be required")
         }
         // find that document
         const isLiked = await Like.findOne({
                                              video: videoId,
                                              likeBy: req.user?._id
                                            })

        if(isLiked)
        {
            // unlike i.e. delete
            await Like.findByIdAndDelete(isLiked._id)

            // return response
             return res
             .status(200)
             .json(new ApiResponse(200, {video_like : true}, "Unliked the video successfully"))
        }

        // like then create documnent
        await Like.create({
                             video: videoId,
                             likeBy: req.user?._id
                         })

            return res
            .status(200)
             .json(new ApiResponse(200, {video_like : true}, "liked the video successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// toggle comment like
const toggleCommentLike = asyncHandler(async(req, res)=>{
    try{
           // take video if from url
         const {commentId}= req.params 
         if(!commentId)
         {
            throw new ApiError(401, "comment Id must be required")
         }
         // find that document
         const isLiked = await Like.findOne({
                                              comment: commentId,
                                              likeBy: req.user?._id
                                            })

        if(isLiked)
        {
            // unlike i.e. delete
            await Like.findByIdAndDelete(isLiked._id)

            // return response
             return res
             .status(200)
             .json(new ApiResponse(200, {comment_like : true}, "Unliked the video successfully"))
        }

        // like then create documnent
        await Like.create({
                             comment: commentId,
                             likeBy: req.user?._id
                         })

            return res
            .status(200)
             .json(new ApiResponse(200, {comment_like : true}, "liked the video successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// toggle tweet like
const toggleTweetLike = asyncHandler(async(req, res)=>{
    try{
            // take video if from url
         const {tweetId}= req.params 
         if(!tweetId)
         {
            throw new ApiError(401, "comment Id must be required")
         }
         // find that document
         const isLiked = await Like.findOne({
                                              tweet: tweetId,
                                              likeBy: req.user?._id
                                            })

        if(isLiked)
        {
            // unlike i.e. delete
            await Like.findByIdAndDelete(isLiked._id)

            // return response
             return res
             .status(200)
             .json(new ApiResponse(200, {Tweet_like : true}, "Tweet the video successfully"))
        }

        // like then create documnent
        await Like.create({
                             tweet: tweetId,
                             likeBy: req.user?._id
                         })

            return res
            .status(200)
             .json(new ApiResponse(200, {Tweet_like : true}, "Tweet the video successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

//get all like of a video 
const getAllLikeOfVideo = asyncHandler(async(req, res)=>{
    try{
         // take video id from url
         const {videoId}= req.params
         if(!videoId)
         {
            throw new ApiError(401, "Video Id Must be required")
         }

         // write a pipelike for count  How many like on this video
         const likedVideo= await Like.aggregate([
                                                   // find document which have videoid
                                                   {
                                                    $match: {video: new mongoose.Types.ObjectId(videoId)}
                                                   },
                                                   {
                                                    $group:{
                                                             _id: null,
                                                             count: {$sum:1}
                                                           }
                                                  },
                                                   // kon kon user like liya hai 
                                                   {
                                                    $lookup:{
                                                              from: "users",
                                                              localField:"likeBy",
                                                              foreignField:"_id",
                                                              as:"user"
                                                            }
                                                   },
                                                  {
                                                    $project: {
                                                                 count: 1,
                                                                 user: {
                                                                         username: 1,
                                                                         fullName: 1,
                                                                         avatar: 1
                                                                       }
                                                              }
                                                  }

                                                ])


            if(likedVideo.length === 0)
            {
               return res
               .status(200)
               .json(new ApiResponse(200, null, "no body like this video yet!"))  
            }

            return res
            .status(200)
            .json(new ApiResponse(200, likedVideo, "no body like this video yet!")) 
       }
    catch(error)
    {
        if(error)
        {
            res.send(error.message)
        }
    }
})

// get all like of a Comment
const getAllLikeOfComment = asyncHandler(async(req, res)=>{
    try{

       }
    catch(error)
    {
        if(error)
        {
            res.send(error.message)
        }
    }
})

// get all like of Tweet
const getAllLikeOfTweet = asyncHandler(async(req, res)=>{
    try{

       }
    catch(error)
    {
        if(error)
        {
            res.send(error.message)
        }
    }
})


export {
        toggleVideoLike,
        toggleTweetLike,
        toggleCommentLike,
        getAllLikeOfVideo
       }