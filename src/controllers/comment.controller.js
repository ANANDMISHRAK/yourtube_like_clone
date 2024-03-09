import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { response } from "express";

// create or add comment

const addComment = asyncHandler(async(req, res)=>{
    try{
         // take comment from body and video id from url
         const {comment}= req.body 
         const {videoId}= req.params 
         if(!comment || !videoId)
         {
            throw new ApiError(401, "comment and video ID must be required")
         }

         // find video document from DB
         const video = await Video.findById(videoId)

         if(!video)
         {
            throw new ApiError(404, "No Video found where you commentwed")
         }

         // create or add comment 
         const commentadd = await Comment.create({
                                                 content: comment,
                                                 video: videoId,
                                                 owner: req.user?._id

                                                  },
                                                  {
                                                    new : true
                                                  }
                                                  )

         if(!commentadd)
         {
            throw new ApiError(500, "Somethings went wrong while creating comment")
         }

         // return response
         return res
         .status(200)
         .json(new ApiResponse(200, commentadd, " commented Successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// Update comment
const updateComment = asyncHandler(async(req, res)=>{
    try{
         // take comment id and new comment 
         const {commentId} = req.params
         const {newComment}= req.body

         if(!commentId || !newComment)
         {
            throw new ApiError(401, "Comment ID and New Comment is required")
         }

         const comment = await Comment.findById(commentId)
         if(!comment)
         {
            throw new ApiError(401, "connemt ID is Invalid")
         }

         const updatedComment = await Comment.findByIdAndUpdate(commentId,
                                                                {
                                                                    $set:{
                                                                           content: newComment
                                                                         }
                                                                },
                                                                {
                                                                    new: true
                                                                })

        if(!updateComment)
        {
            throw new ApiError(500, "Somethings went wrong while updating Comment")
        }

        // return response
        return res
        .status(200)
        .json(new ApiError(200, updateComment, "Comment successfully updated"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// delete comment
const deleteComment = asyncHandler(async(req, res)=>{
    try{
          // take comment id from url
          const commentId= req.params
          if(!commentId)
          {
            throw new ApiError(401, " Comment Id must be required")
          }
 console.log("go for find connent db")
          // find comment document from DB
          const comment = await Comment.findById(commentId)
          if(!comment)
          {
            throw new ApiError(401, " Comment Id is Invalid!")
          }
console.log("comment finded from db")
          // check user is Authorized 
          if(comment.owner.toString() !== req.user?._id.toString())
          {
            throw new ApiError(401, "User is Unauthorized")
          }

          // now delete
          const deletedComment = await Comment.findByIdAndDelete(commentId)

          if(!deletedComment)
          {
            throw new ApiError(500, "Something Wend wrong while deleteing comment")
          }
          // return response
          return res
          .status(200)
          .json(new ApiResponse(200, {}, "Comment deleted successfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// get all comment of a video
const getComment= asyncHandler(async(req, res)=>{
    try{
         // take video id from url
         const {videoId} = req.params
         if(!videoId)
         {
            throw new ApiError(401, "video id must be required")
         }
         const {page=1, limit = 10}= req.query 

         // find video from data base 
         const video = await Video.findById(videoId)
         if(!video)
         {
            throw new ApiError(401, " video id is invalid!")
         }

         // write pipline 
         const commentAggregate = await Comment.aggregate(
                    [
                      {
                        $match:{ video: new mongoose.Types.ObjectId(videoId) },
                      },
                      // finded all comment of that video
                      // find owner of that comment
                      
                      {
                        $lookup :
                                 {
                                   from : "users",
                                   localField:"owner",
                                   foreignField:"_id",
                                   as: "owner"
                                 },
                      },
                      // yet find all comment and comment krne vala
                      // find har comment pe like kitna hai
                      {
                        $lookup : 
                                 {
                                    from: "likes",
                                    localField:"_id",
                                    foreignField: "comment",
                                    as:"likes"
                                 }
                      },
                      // now add all field
                      {
                        $addFields: {
                                      likesCount :{ $size: "$likes"},
                                      owner : {$first: "$owner"},
                                      isLike: {
                                                 $cond:{
                                                         if:{$in: [req.user?._id, "$likes.likeBy"]},
                                                         then: true,
                                                         else: false
                                                       }
                                              }
                                    }
                      },
                      // project data
                      {
                        $project: {
                                     content:1,
                                     createdAt:1,
                                     updatedAt:1,
                                     likesCount:1,
                                     owner:{
                                             username:1,
                                             fullName:1,
                                             avatar:1
                                           },
                                    isLike:1
                                  }
                      }
                    ]
               );

            const options = {
                              page: parseInt(page, 10),
                              limit: parseInt(limit, 10)
                            };

            // now aggregate 
            const comments = await Comment.aggregatePaginate(commentAggregate, options);

            //return response
            return res
            .status(200)
            .json(new ApiResponse(200, comments, "Comment fetched successfully"))
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
         addComment,
         updateComment,
         deleteComment,
         getComment
       }