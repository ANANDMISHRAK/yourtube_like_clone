import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Playlist} from '../models/playlist.model.js'
import { Video } from '../models/video.model.js'
import {User} from '../models/user.model.js'
import {Tweet} from '../models/tweet.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import mongoose from 'mongoose'

// add or create tweet
const addTweet = asyncHandler(async(req, res)=>{
    try{
         // take content of tweet 
         const {content} = req.body 
         if(!content)
         {
            throw new ApiError(401, "content must be required")
         }

         const tweet = await Tweet.create({
                                            content,
                                            owner:req.user?._id
                                          })

            if(!tweet)
            {
                throw new ApiError(401, "Somethings went wrong while add tweet")
            }

            // return response
            return res
            .status(200)
            .json(new ApiResponse(200, tweet, "tweet created successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// update tweet
const updateTweet = asyncHandler(async(req, res)=>{
    try{
         // take tweet id from url
         const {tweetId}= req.params 
         if(!tweetId)
         {
            throw new ApiError(401, "Tweet id is required")
         }
         // take new content
         const {content}= req.body 
         if(!content)
         {
            throw new ApiError(401, "updated content must be required")
         }

         const tweet = await Tweet.findById(tweetId)

         if(!tweet)
         {
            throw new ApiError(404, "Tweet Id is Invalid!")
         }

         // authenticate user
         if(tweet.owner.toString() !== req.user?._id.toString())
         {
            throw new ApiError(404, " User is unauthorized")
         }

         // now update 
         const updateTweets= await Tweet.findByIdAndUpdate(
                                                           tweetId,
                                                           {
                                                            $set:{
                                                                   content
                                                                 }
                                                           },
                                                           {new:true}
                                                          )
        if(!updateTweets)
        {
            throw new ApiError(500, "Something went wrong while updating Tweet")
        }
        // return res
        return res
        .status(200)
        .json(new ApiResponse(200, updateTweets, "Successfully Tweet updated"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

//delete tweet
const deleteTweet= asyncHandler(async(req, res)=>{
    try{
         // take tweet id from url
         const {tweetId}= req.params 
         if(!tweetId)
         {
            throw new ApiError(401, "Tweet id Must be required")
         }

         // find tweet document from dataBase
          const tweet = await Tweet.findById(tweetId)

          if(!tweet)
          {
            throw new ApiError(401, "Tweet Id is Invalid!")
          }

        // user Authorized or not
        if(tweet.owner.toString() !== req.user?._id.toString())
        {
            throw new ApiError(404, "UnAuthorized User")
        }
        // delete tweet

         const deletesTweet= await Tweet.findByIdAndDelete(tweetId)

         if(!deletesTweet)
         {
            throw new ApiError(500, "Somethings went Wrong While deleting Tweets")
         }

         // return response
         return res
         .status(200)
         .json(new ApiResponse(200, deletesTweet, "Tweet successfully deleted"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// get all Tweets of a user
const getTweet = asyncHandler(async(req, res)=>{
    try{
         // take user id from url
         const {userId}= req.params
         if(!userId)
         {
            throw new ApiError(401, "User id must be required")
         }

         // find user from DB
         const user = await User.findById(userId)

         if(!user)
         {
            throw new ApiError(401, "Invalid user Id")
         }

         // pipline aggregration
         const userTweet = await Tweet.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(userId)}
            },
            {
                $lookup:{
                          from:"users",
                          localField:"owner",
                          foreignField:"_id",
                          as:"user"
                        }
            },
            {
                $unwind:"$user"
            },
            {
                $group:{
                         _id:null,
                         content:{$push: "$content"},
                         User: {$first:"$user"}
                       }
            },
           {
            $project:{
                        _id:0,
                        content:1,
                        User:{
                                fullName:1,
                                avatar:1,
                                email:1,
                                username:1
                             }
                     }
           }
         ])

         if(userTweet.length === 0)
         {
            return res
            .status(200)
            .json(new ApiResponse(200, null, `No Tweets found user  ${user.username}`))
         }

         return res
         .status(200)
         .json(new ApiResponse(200, userTweet, `Tweets fetched SuccessFully`))

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
        addTweet,
        updateTweet,
        deleteTweet,
        getTweet
       }