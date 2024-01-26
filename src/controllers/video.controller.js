import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deletefromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    try{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    if(!userId)
    {
        throw new ApiError(401, " required UserId")
    }
  // create array of pipeline
    const pipeline =[]

    //for using full text based search then need to create a search index in DB collection
    // you can inclide field mapping in search index eg: title , description, as well 
    // field mapping specify which fields within your document should be indexed for text search.
    //this help in searching only in title, description providing faster search results
    // here the name of search index is  " search-video"

    if(query)
    {
        pipeline.push({
                       $search :{
                                  index:"searchVideo",
                                  text: {
                                         query:query,
                                         path: ["description", "title"]
                                        }
                                }
                     });

    }

    //filter video document according user id, and push in pipline array
    pipeline.push({
                   $match: {
                             owner: new mongoose.Types.ObjectId(userId)
                           }
                 })

    // fetch videos only that are set publice status as true
    pipeline.push({$match:{isPublished: true}});

    // sortBy can be view, cretateAt , duration
    // sortType can be ascending (1) or descending(-1)
    if(sortBy && sortType)
    {
       pipeline.push({
                       $sort: {
                                [sortBy]: sortType ==='asc'?1 :-1
                              }
                    });
    }
    else{
        pipeline.push({$sort: {createdAt : -1}});
    }
    //aggerate video according to pipline
    const videoAggregate =await Video.aggregate(pipeline)

    // create option 
    const options = {
                      page : parseInt(page, 10),
                      limit : parseInt(limit, 10)
                    };

    // aggregate the video
    const video = await Video.aggregatePaginate(videoAggregate, options);

    //return response
    return res
    .status(200)
    .json(new ApiResponse(200, video, "video featched successfully"))
    }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    try{
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
     if(!title && ! description)
     {
        throw new ApiError(401, " title and Description is required")
     }
     // get video from multer or backend req. file
     const videoLocalPath= req.files?.videoFile[0]?.path
     const thumbnailLocalPath = req.files?.thumbnail[0]?.path
     if(!videoLocalPath)
     {
        throw new ApiError(401, " video local path is required")
     }
     if(!thumbnailLocalPath)
     {
        throw new ApiError(401, " Thumbnail local path is required")
     }
     // now video upload on cloudinary
     const videoUpload = await uploadOnCloudinary(videoLocalPath)
     
     if(!videoUpload.url)
     {
        throw new ApiError(401, "Video not uploated on cloudinary")
     }
     const thumbnailUpload= await uploadOnCloudinary(thumbnailLocalPath)

     if(!thumbnailUpload.url)
     {
        throw new ApiError(401, "thumbnail not uploated on cloudinary")
     }
     // video uploded 
     // save video url in database - video url, userid , description , duration fron cloudinary result, 
     const video = await Video.create(
        {
            videoFile: {
                         url: videoUpload.url,
                         public_id: videoUpload.public_id
                       },
            thumbnail :{
                         url: thumbnailUpload.url,
                         public_id: thumbnailUpload.public_id
                       },
            title,
            description,
            duration :videoUpload.duration,
            isPublished: true,
            owner: req.user._id
        }
     )

     // now check Db me created or not
     const videoUploaded = await Video.findById(video._id)

     if(!videoUploaded)
     {
        throw new ApiError(401, "Video uploaded failed , Please try again")
     }

     //return response
     return res
     .status(200)
     .json(new ApiResponse(200, video, " Video sucessfully uploaded "))
    }
    catch(error){
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }


})

const getVideoById = asyncHandler(async (req, res) => {
    try{ 
    const { videoId } = req.params
    if(!videoId)
     {
        throw new ApiError(401, "video id is required!")
     }
    //TODO: get video by id
    const video = await Video.findById(videoId).select("-videoFile.public_id  -thumbnail.public_id")
    if(!video)
    {
      throw new ApiError(401, "video is not avabilble")
    }
    // return response
    return res
    .status(200)
    .json(new ApiResponse(200, video, "video details!"))
   }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }

})

const updateVideo = asyncHandler(async (req, res) => {
    try{
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!videoId)
    {
        throw new ApiError(401, "Video id is required")
    }

    // take like , title , description thumbnail
    const {title, description}= req.body
    if(!(title && description))
    {
        throw new ApiError(401, "Title and description is required")
    }
    // take thumbnail from req. file
    const {thumbnailLoaclPath}= req.file.path
    if(!thumbnailLoaclPath)
    {
        throw new ApiError(401, "Thumbnail is required")
    }

    // find video from video collection 

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(401, "this video is not avilable ")
    }

    // take all about user req.user-> jo video update krega kya ye ussi ka channel hai
     if(video.owner.toString() !== req.user?._id.toString())
     {
        throw new ApiError(401, "Unauthorized to update")
     }

     //now upload thubmnail on cloudnary and delete old thumbnail after sucefffull upload new thumbnail
     

     const uploadNewThumbnail = await uploadOnCloudinary(thumbnailLoaclPath);
     if(!uploadNewThumbnail.url)
     {
        throw new ApiError(401, "Thubnail is not uploaded")
     }

     // uploaded new thumbnail then delete old
     const deleteoldThumbnail= await deletefromCloudinary(Video.thumbnail.public_id)

     if(!deleteoldThumbnail)
     {
        throw new ApiError(401, " old thumbnil is not deleted ")
     }

     // update in collection document
     const updateVideo = await Video.findByIdAndUpdate(
                                                        videoId,
                                                        {
                                                            $set: {
                                                                    title,
                                                                    description,
                                                                    thumbnail :{
                                                                                 url: uploadNewThumbnail.url,
                                                                                 public_id: uploadNewThumbnail.public_id
                                                                               }
                                                                  }
                                                        } ,
                                                        {
                                                            new : true
                                                        }

                                                      )
            // update then now check update or not
            if(!updateVideo)
            {
                throw new ApiError(401," not update Video")
            }

            // return response
            return res
            .status(200)
            .json(new ApiResponse(200, updateVideo , " Video successfully updated !"))

    }
    catch(error)
    {
       if(error instanceof ApiError)
       {
        res.send(error.message)
       }
    }

})

const deleteVideo = asyncHandler(async (req, res) => {

    try{
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId)
    {
        throw new ApiError(401, "video id is required")
    }
    // check jo user video delete krna cahta hai kya o owner hai video ka then hi delete krega
      // find video from db
      const videoFnDb = await Video.findById(videoId)

      if(!videoFnDb)
      {
        throw new ApiError(401, "video does not exist")
      }

      // check video owner is equal to user id
      if(videoFnDb.owner.toString() !== req.user?._id.toString())
      {
        throw new ApiError(401, " Unauthorized to delete video")
      }

      // now delete thumbnail and video
      const videoDelete = await deletefromCloudinary(videoFnDb.videoFile.public_id)
      if(!videoDelete)
      {
        throw new ApiError(401, "Video does not delete")
      }
      // delete thubmanil
      const deleteThumbnail = await deletefromCloudinary(videoFnDb.thumbnail.public_id)
      if(!deleteThumbnail)
      {
        throw new ApiError(401, "thumbnail does not deleted")
      }
      // update in document
      const deleteVideoDB = await Video.findByIdAndUpdate(videoId)
        if(!deleteVideoDB)
        {
            throw new ApiError(401, " not deleted video")
        }
        // return response
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "sucessfully deleted !"))
     }
    catch(error)
    {
      if(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try{
    const { videoId } = req.params
    if(! videoId)
    {
        throw new ApiError(401, "Video id is required")
    }

    // find all things of video from DB
    const video = await Video.findById(videoId);

    if(!video)
    {
        throw new ApiError(401, "Video Id is unvalid")
    }

    // user is coreect to change in video DB
    if(video.owner.toString() !== req.user?._id.toString())
    {
        throw new ApiError(401, "UnAuthorized to access")
    }

    // user is correct , so change now
    const toggleVideoStatus = await Video.findByIdAndUpdate(
                                                              videoId,
                                                              {
                                                                $set :{
                                                                        isPublished : !video.isPublished
                                                                      }
                                                              }
                                                           )

    // check 
    if(!togglePublishStatus)
    {
        throw new ApiError(401, "video status is not change")
    }

    // return response
    return res
    .status(200)
    .json( new ApiResponse(200, toggleVideoStatus, "video status successfully change"))

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
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}