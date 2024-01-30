import {Playlist} from '../models/playlist.model.js'
import { Video } from '../models/video.model.js'
import {User} from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import mongoose from 'mongoose'


// create PlayList
const createPlaylist = asyncHandler(async(req, res)=>{
    try{
         // at create time :
         // 1 -> name of playlist
         // description of playlist
         //so take name and description from body
         const {name, description}= req.body 
         
         if(!name || !description)
         {
            throw new ApiError(401, "Playlist Name and Description is required")
         }
         // create 
         const playlist = await Playlist.create({
                                                  name,
                                                  description,
                                                  owner: req.user?._id
                                                })

        if(!playlist)
        {
            throw new ApiError(500, "Somethings went wrong during create playlist")
        }

        // return response
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist created"))
       }
    catch(error)
    {
      if(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }
})

//add video in playlist
const addVideoInPlaylist = asyncHandler(async(req, res)=>{
    try{
         // take playlist id and video id from url
         const {playlistId, videoId}= req.params 
         if(!playlistId || !videoId)
         {
            throw new ApiError(401, " playlist ID & video ID is required")
         }
         // find from DB
         const playlist = await Playlist.findById(playlistId);
         if(!playlist)
         {
            throw new ApiError(401, "PlayList Id is Invalid!")
         }
         const video =await Video.findById(videoId)
         if(!video)
         {
            throw new ApiError(401, "Video Id is Invalid!")  
         }
      // now check user id Authorized or not this work
      if(playlist.owner !== req.user?._id || video.owner !== req.user?._id)
      {
        throw new ApiError(401," user does not Azuthorized this work")
      }

      // now update
       const addVideo = await Playlist.findByIdAndUpdate(
                                                         playlist._id,
                                                        {
                                                          $addToSet :{
                                                                  videos : video._id
                                                                },
                                                         },
                                                         {
                                                            new : true
                                                         }
                                                         );
        if(!addVideo)
        {
            throw new ApiError(401, "Failed to add in Playlist ")
        }
        // return response
        return res
        .status(200)
        .json(new ApiResponse(200, addVideo, "Video is added in Playlist"))
       }
    catch(error)
    {
     if(error instanceof ApiError)
     {
        res.send(error.message)
     }
    }
})

// remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async(req, res)=>{
    try{
         // take id from url
         const {videoId, playlistId}= req.params

         if(!videoId || !playlistId)
         {
            throw new ApiError(401, " video and playlist Id must be required")
         }
         // find from DB
         const video = await Video.findById(videoId)
         if(!video)
         {
            throw new ApiError(401, "Video ID is invalid!")
         }
         const playlist = await Playlist.findById(playlistId)
         if(!playlist)
         {
            throw new ApiError(401, "Playlist id is invalid")
         }

         // check user Authorized or not
         if(playlist.owner !== req.user?._id || video.owner !== req.user?._id)
         {
           throw new ApiError(401," user does not Azuthorized this work")
         }

         // remove from DB
         const removeVideo = await Playlist.findByIdAndUpdate( playlistId,
                                                               {
                                                                 $pull: {
                                                                          videos: videoId
                                                                        }
                                                               } ,
                                                               {
                                                                new : true
                                                               }                              
                                                             );

        if(!removeVideo)
        {
            throw new ApiError(401, "Somethings went wrong")
        }

        // return response
        return res
        .status(200)
        .json(new ApiResponse(200, removeVideo, "Removed Video from Playlist"))
       }
    catch(error)
    {
       if(error instanceof ApiError)
       {
        res.send(error.message)
       }
    }
})

// get playlist by id
const getPlaylistByID = asyncHandler(async(req, res)=>{
    try{
         // take id from url
         const {playlistId}= req.params
         if(!playlistId)
         {
            throw new ApiError(401, " playlist id must be required ")
         }

         // find from DB
         const playlist = await Playlist.findById(playlistId)
         if(!playlist)
         {
            throw new ApiError(401, " playlist Id is invalid!")
         }

         // write pipline aggregration
         const playlistVideo = await Playlist.aggregate([
                                                          {
                                                            $match: {_id:new mongoose.Types.ObjectId(playlistId)}
                                                          },
                                                          //in above query -> find palylist which id match
                                                          // find all video in this playlist
                                                          {
                                                            $lookup: {
                                                                       from: "videos",
                                                                       localField: "videos",
                                                                       foreignField:"_id",
                                                                       as:"videos"
                                                                     }
                                                          },
                                                          //finded all video of that playlist
                                                          // select only those video which status true
                                                          {
                                                            $match: {"videos.isPublished":true}
                                                          },
                                                          // find owner of that video
                                                          {
                                                            $lookup:{
                                                                      from:"users",
                                                                      localField:"owner",
                                                                      foreignField:"_id",
                                                                      as:"owner"     
                                                                    }
                                                          },
                                                          // all finded is add or sore in one
                                                          {
                                                            $addFields: {
                                                                          totalVideo:{$size:"$videos"},
                                                                          totalViews: {$sum:"$videos.view"},
                                                                          owner : {$first : "$owner"}
                                                                        }
                                                          },
                                                          // project these data
                                                          {
                                                            $project:{
                                                                        name:1,
                                                                        description:1,
                                                                        createdAt:1,
                                                                        updatedAt:1,
                                                                        totalVideo:1,
                                                                        totalViews:1,
                                                                        videos: {
                                                                                  _id:1,
                                                                                  "videoFile.url":1,
                                                                                  "thumbnail.url":1,
                                                                                  title: 1,
                                                                                  description:1,
                                                                                  duration: 1,
                                                                                  createdAt:1,
                                                                                  view: 1
                                                                                 },
                                                                        owner: {
                                                                                 username:1,
                                                                                 fullName:1,
                                                                                 avatar:1
                                                                               }
                                                                     }
                                                          }
                                                        ]);

    //return response
    return res
    .status(200)
    .json(new ApiResponse(200, playlistVideo, "Playlist fetched successfully"))
       }
    catch(error)
    {
      if(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }
})

// get user all playlist
const getUserAllPlaylis = asyncHandler(async(req, res)=>{
    try{
        // take user id from url
        const {userId}= req.params
        if(!userId)
        {
            throw new ApiError(401, "User Id must be required")
        }
        const user = await User.findById(userId)
        if(!user)
        {
            throw new ApiError(401, "User ID is Invalid!")
        }

        // write Pylaylist pipeline aggregration
        const playlist = await Playlist.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(userId)}
            },
            // finded all playlist which owner is matched
            {
                $lookup: {
                          from: "videos",
                          localField: "videos",
                          foreignField:"_id",
                          as:"videos"
                         }
            },
            //finded all video document which added in playlist
            // abhi tak -> find kiya hu-> all playlist of user && video of all playlid 
            // now go to find all this of user
            {
               $lookup: {
                          from:"users",
                          localField:"owner",
                          foreignField:"_id",
                          as:"owner"
                        }
            },
            // add and project all data
            {
                $addFields: {
                              totalVideo:{ $size: "$videos"},
                              totalViews:{$size:"$videos.view"},
                              owner: {$first: "$owner"}
                            }
            },
            {
                $project: {
                            name:1,
                            description:1,
                            createdAt:1,
                            updatedAt:1,
                            totalVideo:1,
                            totalViews:1,
                            videos: {
                                      _id:1,
                                      "videoFile.url":1,
                                      "thumbnail.url":1,
                                      title: 1,
                                      description:1,
                                      duration: 1,
                                      createdAt:1,
                                      view: 1
                                     },
                            owner: {
                                     username:1,
                                     fullName:1,
                                     avatar:1
                                   }
                         }
                          
            }
        ])

        if(!playlist)
        {
            throw new ApiError(401," Somethings went wrong getting user Playlist")
        }
        //return response
        return res
        .status(200)
        .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))
       }
    catch(error)
    {
      if(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }
})

//update playlist
const updatePlaylist = asyncHandler(async(req, res)=>{
    try{
          // take playlist id from url
          const {playlistId}= req.params
          if(!playlistId)
          {
            throw new ApiError(401, "Playlist Id must be required ")
          }

          const {title, description}= req.body
          if(!title || !description)
          {
            throw new ApiError(401, "title & description is required")
          }

          // find playlist document
           const playlist= await Playlist.findById(playlistId)
           if(playlist)
           {
            throw new ApiError(401, "Playlis id is invalid")
           }

           // update
           const updatedPlaylist = await Playlist.findByIdAndUpdate(playlist?._id,
                                                                    {
                                                                      $set: {
                                                                              title,
                                                                              description
                                                                             }
                                                                    },
                                                                    {
                                                                        new : true
                                                                    })

            if(!updatedPlaylist)
            {
                throw new ApiError(401, "Something went wrong during update")
            }

            // return response
            return res
            .status(200)
            .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
       }
    catch(error)
    {
       if(error instanceof ApiError)
       {
        res.send(error.message)
       }
    }
})

// delete playlist 
const deletePlaylist = asyncHandler(async(req, res)=>{
    try{
         // take playlist id from url
         const {playlistId}= req.params
         if(!playlistId)
         {
            throw new ApiError(401, "Playlist Id must be required ")
         }

         // find document from DB
         const playlist = await Playlist.findById(playlistId)
         if(!playlist)
         {
            throw new ApiError(401, "Playlist Id is Invalid!")
         }

         // check user Authorized or not
         if(playlist.owner.toString() !== req.user._id.toString())
         {
            throw new ApiError(401, "User unAuthorized for this work")
         }

         const deleteplaylist= await Playlist.findByIdAndDelete(playlistId);
         if(!deleteplaylist)
         {
            throw new ApiError(401, " somethings went wrong during the delete playlist")
         }

         // return response
          return res
          .status(200)
          .json(new ApiResponse(200, deleteplaylist, "Playlist Deleted successfully"))
       }
    catch(error)
    {
      IdleDeadline(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }
})


export {
         createPlaylist,
         addVideoInPlaylist,
         removeVideoFromPlaylist,
         getPlaylistByID,
         getUserAllPlaylis,
         updatePlaylist,
         deletePlaylist
       }