import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//get channel status of user
const getChannelStats = asyncHandler(async(req, res)=>{
    try{
         const {userId}= req.user?._id 
         // get total subscriber of this user
         const totalSubscribers = await Subscription.aggregate([
                                                                 {
                                                                    $match: {channel: new mongoose.Types.ObjectId(userId)}
                                                                 },
                                                                 {
                                                                    $group:{
                                                                            _id:null,
                                                                            subscriberCount: {$sum:1}
                                                                           }
                                                                 }
                                                               ]);
            
          // get video status
           const videoStats =await Video.aggregate([
                                                    {
                                                        $match: {owner: new mongoose.Types.ObjectId(userId)}
                                                    },
                                                    {
                                                        $lookup: {
                                                                   from:"likes",
                                                                   localField:"_id",
                                                                   foreignField:"video",
                                                                   as:"likes"
                                                                 }
                                                    },
                                                    {
                                                        $project: {
                                                                    totalLikes:{$size: "$likes"},
                                                                    totalView: "view",
                                                                    totalVideo:1
                                                                  }
                                                    },
                                                    {
                                                        $group: {
                                                                  _id: null,
                                                                  totalLikes:{$sum: "$totalLikes"},
                                                                  totalViews: {$sum: "$totalView"},
                                                                  totalVideo: {$sum:1}
                                                                }
                                                    }
                                                  ])

         const channelStats= {
                               totalSubscribers: totalSubscribers[0]?.subscriberCount || 0,
                               totalLikes: videoStats[0]?.totalLikes || 0,
                               titalViews: videoStats[0]?.totalViews || 0,
                               totalVideo : videoStats[0]?.totalVideo || 0
                             };

         return res
         .status(200)
         .json(new ApiResponse(200, channelStats, "Channel status fetched successfully"))
      }
    catch(error)
    {
        return res
         .status(500)
         .json(new ApiResponse(500, error, "Channel status does not fetched."))
    }
})


// get channel all video
const getChannelVideo = asyncHandler(async(req, res)=>{
    try{
        const {userId}= req.user?._id 

         // get all videos uploaded by the channel or this user

         const videos = await Video.aggregate([
                                                 { 
                                                    $match: { owner: new mongoose.Types.ObjectId(userId)}
                                                 },

                                                 {
                                                    $lookup: {
                                                               from: "like",
                                                               localField:"_id",
                                                               foreignField:"video",
                                                               as:"likes"
                                                              }
                                                 },
                                                 {
                                                    $addFields: {
                                                                  createAt : {$dataToParts: {date: "$createdAt"}},
                                                                  likeCount : {$size: "$likes"}
                                                                }
                                                 },
                                                 {
                                                    $project : {
                                                                 _id:1,
                                                                 "videoFile.url":1,
                                                                 "thumbnail.url":1,
                                                                 title: 1,
                                                                 description:1,
                                                                 createdAt: {
                                                                              year: 1,
                                                                              month: 1,
                                                                              day:1
                                                                             },
                                                                isPublished: 1,
                                                                likeCount:1
                                                               }
                                                 }

                                              ])

            return res
            .status(200)
            .json(new ApiResponse(200, videos, " channel videos fetched successfully"))
       }
    catch(eroor)
    {
        return res
        .status(500)
        .json(new ApiResponse(500, null, " channel videos does not fetched "))
    }
})


export {
        getChannelStats,
        getChannelVideo
       }