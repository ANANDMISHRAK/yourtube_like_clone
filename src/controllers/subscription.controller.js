import mongoose  from "mongoose";
import {Subscription} from '../models/subscription.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// if subscribed then unsubscribe and vise-versa
const toggleSubscription = asyncHandler(async(req, res)=>{
    try{
           // take channel id from url when came this channel
           const {channelId} = req.params 
           if(!channelId)
           {
            throw new ApiError(401, "Channel id must be required")
           } 

           // find user subscribe or not in Subscription collection
           const isSubscribe = await Subscription.findOne({
                                                           subscriber: req.user?._id,
                                                           channel: channelId 
                                                          })

            // if subscribe then unsubscribe
            if(isSubscribe)
            {
                await Subscription.findByIdAndDelete(isSubscribe?._id)

                // return response
                 return res
                 .status(200)
                 .json(new ApiResponse(200, {subscriber : false}, "Unsubscribed Successfully"))
            }

            // nor subscribe then subscribe
            await Subscription.create({
                                       subscriber: req.user?._id,
                                       channel: channelId        
                                      })

                // return response
                return res
                 .status(200)
                 .json(new ApiResponse(200, {subscriber : true}, "Subscribed Successfully"))

       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// how many subscriber have at user channel
const getUserChannelSubscriber = asyncHandler(async(req, res)=>{
    try{
          // take channel id from url 
          const {channelId} = req.params 
          if(!channelId)
          {
           throw new ApiError(401, "Channel id must be required")
          }
          
          // pipleline
          const subscribers = await Subscription.aggregate([
                                                              {
                                                                $match:{channel : new mongoose.Types.ObjectId(channelId)}
                                                              },
                                                              //yet find all document of this channel
                                                              // now to to find -> who are subscribe this channel
                                                              {
                                                                $lookup : {
                                                                           from: "users",
                                                                           localField:"subscriber",
                                                                           foreignField:"_id",
                                                                           as:"user"
                                                                           }
                                                              },
                                                              // make a group 
                                                              {
                                                                $group: {
                                                                           _id: null,
                                                                           totalCount:{$sum: 1},
                                                                           usernames:{$push:"$user.username"}
                                                                        }
                                                              },
                                                              {
                                                                $project: {
                                                                            totalCount:1,
                                                                            usernames:1
                                                                          }
                                                              }
                                                            ]);

            if(subscribers.length ===0)
            {
                return res
                .status(200)
                .json(new ApiResponse(200, null, "No Subscribers found for thid Channel"))
            }


            return res
                .status(200)
                .json(new ApiResponse(200, subscribers, "No Subscribers found for thid Channel"))

       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})


// a user A-> how many channel subscribed 
// controller to return channel list to which user has subscribed
const getSubscribeChannel = asyncHandler(async(req, res)=>{
    try{
         const {userId}= req.params
         if(!userId)
         {
            throw new ApiError(401, "User id must be required") 
         }

         // pipeline for find all channel 
         const subscribedChannel = await Subscription.aggregate([
                                                                  // all document which subscribet match to user id
                                                                  {
                                                                    $match: {subscriber: new mongoose.Types.ObjectId(userId)}
                                                                  },
                                                                  // now find channel owner profile
                                                                  {
                                                                    $lookup: {
                                                                               from: "users",
                                                                               localField:"channel",
                                                                               foreignField:"_id",
                                                                               as:"channelOwnerProfile"
                                                                             }
                                                                  },
                                                                  {
                                                                    $unwind: "channelOwnerProfile"
                                                                  },
                                                                  {
                                                                    $replaceRoot:{newRoot:"$channelOwnerProfile"}
                                                                  },
                                                                  {
                                                                    $project:{
                                                                               _id:1,
                                                                               username:1,
                                                                               fullName:1,
                                                                               avatar:1
                                                                             }
                                                                  }
                                                                ]);

        
   // return response
   return res
   .status(200)
   .json(new ApiResponse(200, subscribedChannel, "subscribed channel fetch successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})


export {
        toggleSubscription ,
        getUserChannelSubscriber,
        getSubscribeChannel
       }