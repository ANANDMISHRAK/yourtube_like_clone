import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { deletefromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import Jwt from "jsonwebtoken"

// generate access token method
const generateAccessAndRefreshToken = async (userid) => {
  try {
   // console.log("in side user registration controller")
    const user = await User.findById(userid)

    const accessToken = user.generateAccessToken()
   // console.log(acessToken);
    const refereshToken = user.generateRefreshToken()
   // console.log(refereshToken)

    user.refreshToken = refereshToken
   // user.accessToken= accessToken
    //console.log("user.retocken  : ", user.refereshToken)
    await user.save({ validateBeforeSave: false })

    return { accessToken, refereshToken }
  }
  catch (error) {
    throw new ApiError(500, "somethis went wrong while generate Access or Referesh Token")
  }
}


// const registerUser = asyncHandler(async (req, res) => {
//   console.log("come to register controller")
//   // 1) get user details from frontend 
//   const { fullName, email, userName, password } = req.body
//   console.log("----", fullName, email, userName, password)
//   // check all field got or not
//   if (
//     [fullName, email, userName, password].some((field) =>{ return field?.trim() ==='' ||field?.trim() === undefined })
//     ){
//     console.log("req -->", field)
   
//     throw new ApiError(400, " All Fields are required")
//    }

//   if(fullName===undefined)
//   {
//     console.log("required fullname")
    
//     throw new ApiError(400, " All Fields are required") 
    
//   }
  
//   console.log("----", fullName, email, userName, password)

//   // if got all field 
//   // check user all ready exist or not
//   const exitedUser = await User.findOne({
//     $or: [{ userName }, { email }]
//   })

//   if (exitedUser) {
//     console.log("exited user")
//     throw new ApiError(409, "User allready exist with userName or Email")
//   }
//   if(!exitedUser)
//   {
//     console.log("youu are nuw user", exitedUser)
//   }

//   // user not exit then
//   // check avatar & coverImage --> avatar required and coverImage may be

//   const avatarImageLocalPath = req.files?.avatar[0]?.path;

//   console.log("avatar res is came",avatarImageLocalPath )

//   // const coverInageLocalPath = req.files?.coverImage[0]?.path
//   // cover image may be so got undifine so take handle it
//   let coverInageLocalPath
//   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//     coverInageLocalPath = req.files.coverImage[0].path
//   }
//   //validate avatar image 
//   if (!avatarImageLocalPath) {
//     throw new ApiError(400, " Avatar image must be require")
//   }

//   // if avatar is then -> upload backend to cloudinary
//   const avatar = await uploadOnCloudinary(avatarImageLocalPath)
//   const coverImage = await uploadOnCloudinary(coverInageLocalPath)
//   console.log("uploded on clouninary from controller", avatar)
//   // check successfully avatar upload or not
//   if (!avatar) {
//     throw new ApiError(400," avatar is not uploaded on Cloudinary")
//   }
//    console.log(User)
//   // yet all data sucessfully set , now need to create object and saVE IN database 
//   const user = await User.create({
//     fullName,
//     email,
//     userName: userName.tolowerCase(),
//     avatar: avatar.url,
//     coverImage: coverImage?.url || null,
//     password
//   },)

//   await user.save();
//     console.log("after create -->",user)
//   // check user save sucessfull & in response remove password and token
//   const createUser = await User.findById(user._id).select("-password -refereshToken")
//   console.log("------", createUser)

//   if (!createUser) {
//     throw new ApiError(500, "sometings went wrong While registering the User")
//   }

//   return res.status(201).json(
//     new ApiResponse(200, createUser, "user registered Successfully")
//   )

// }
// )


const registerUser = asyncHandler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  try{
  const {fullName, email, username, password } = req.body
 // console.log("email: ", email);
   
  if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
      throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  })

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
  //console.log(req.files);
  //  if(!existedUser)
  //  {
  //   console.log("user not in db")
  //  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
//console.log(avatarLocalPath)
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  
 // console.log("c i :-  ", coverImageLocalPath)
  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  //console.log("avatar -  ", avatar.url)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
  }
 
  //console.log(coverImage.url)
  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage:coverImage.url || "",
      avatarUplicId:avatar.public_id,
      coverPublicId:coverImage?.public_id || "",
      email, 
      password,
      username: username.toLowerCase()
  })
  //  if(!user || user===null)
  //  {
  //   throw new ApiError(405, "Db for this user is not created")
  //  }
  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )

  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  )

}
catch(err){
   if(err instanceof ApiError){
    console.log(err.message)
    res.send(err.message)
   } 
}


})




const loginUser = asyncHandler(async (req, res) => {
  try{
  //1.  take data from user
  const { email, username, password } = req.body
  //2. data validate
  console.log(username,  email, password)
  if (!username || !email) {
    throw new ApiError(400, "UserName or Email is required")
  }
  //3. find user from DB
  const user = await User.findOne(
    {
      $or: [{ username }, { email }]
    }
  )
  
 // console.log("---user", user)
  //check user data base se find huaa ya nhi
  if (!user) {
    console.log("---user", user)
    throw new ApiError(404, "User does not exist, go for registration")
  }
 // console.log("---user", user)
  // now user find then password validate and compaire with DB sored password
  const isPasswordValid = await user.isPasswordCorrect(password)
  // console.log("..password check ", isPasswordValid)
  // validate with DB password
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password")
  }

  //5. generate access token using method in above according to user id
  const { accessToken, refereshToken } = await generateAccessAndRefreshToken(user._id)

  //6. send throw coolis
  const loginUser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, option)
    .cookie("refereshToken", refereshToken, option)
    .json(new ApiResponse(
      200,
      {
        user: loginUser, accessToken, refereshToken
      },
      "User logged in sucessfully"
    ))
 }
 catch(error){
      if(error instanceof ApiError)
      {
        res.send(error.message)
      }
    }
})

const logOutUser = asyncHandler(async(req, res)=>{
    try{
         // get response from verifyJWT controller from middleware->auth.middleware.js-> here check userlogin or not
         // and if log in then send responce , in responce got here all things of user
         //then task 1) update DB refresh token ->undefined i.e not access to use now without login 
          await User.findByIdAndUpdate(
                                        req.user._id,
                                        {
                                          // $set:{
                                          //        refreshToken: undefined
                                          //      },
                                          $unset: {
                                            refreshToken: 1 // this removes the field from document
                                        }
                                        },
                                        {
                                          new: true
                                        }
                                       )

          // task 2) send response
          // option user for not change response value by user, only change by server or Backen
           const options ={
                            httpOnly: true,
                            secure: true
                          }
            return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User successfully LogOut"))
       }
    catch(error){
                  res.send(error.message)
                }
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
  try{
     // 1) take refresh token
      const incommingRefreshToken= req.cookies.refereshToken || req.body.refereshToken
  // console.log(incommingRefreshToken)
      if(!incommingRefreshToken)
      {
        throw new ApiError(401, "UnAuthorized Request")
      }
      //2 got refresh Token then decode it
      const decodeRefreshToken= Jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRT)

      //3 find from DB 
      const user= await User.findById(decodeRefreshToken?._id)

      if(!user)
      {
        throw new ApiError(401, "Invalid refresh Token ")
      }
    //console.log("user r t:  ", user)
    // 4 now compire commingRefreshToken and DB refresh Token
      if( incommingRefreshToken !== user?.refreshToken)
      {
        throw new ApiError(401, "Refresh Token is expired or used ")
      }


      //5 generate token both 
      const {accessToken, newRefreshToken}=await generateAccessAndRefreshToken(user._id)

      // 6 response send
       const options ={
                        httpOnly: true,
                        secure: true
                      }
      

      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, 
                            {accessToken, refreshToken:newRefreshToken},
                            "Access Token Refreshed"
                           ))

     }
  catch(error){
               if(error instanceof ApiError)
               {
                 res.send(error.message)
               }
              //  else 
              //     res.send(error.message)
              }
})

const changePassword = asyncHandler(async(req, res)=>{
  try{
      //1 take data from body
      const {oldPassword, newPassword}= req.body
      //2 find user from db
      const user= await User.findById(req.user._id)

      //3 check oldPassword with DB
      const isPassword= await user.isPasswordCorrect(oldPassword)

      if(!isPassword)
      {
        throw new ApiError(401, "Invalid old Password")
      }

      // change DB password with new password
      user.password= newPassword
      // save in DB
      await user.save({validateBeforeSave: false})

      // return response
      return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password change SuccessFully"))

     }
  catch(error){
                if(error instanceof ApiError)
                {
                  res.send(error.message)
                }
              }
})


const getCurrentUser = asyncHandler(async(req, res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200, req.user , "current user feched successfully"))
})

const updateAccountDetails= asyncHandler(async(req, res)=>{
  try{
       // take fullname ans email from req.body
       const {fullName, email}= req.body
        if(!fullName || !email)
        {
          throw new ApiError(400, " required FullName and Email")
        }
       //find user and update using req.user._id
       const user= await User.findByIdAndUpdate(
                                                 req.user?._id,
                                                 {
                                                  $set:{
                                                         fullName,
                                                         email
                                                       }
                                                 },
                                                 {
                                                  new: true
                                                 }
                                               ).select("-password")
                                    
          // return response
          return res
          .status(200)
          .json(new ApiResponse(200, user, " Account successfully updated"))
     }
  catch(error){
                if(error instanceof ApiError)
                {
                  res.send(error.message)
                }
              }
})

 const updateAvatar = asyncHandler(async(req, res)=>{
  try{
       //1 take locatl image path from req.file
       const localAvatarPath= req.file?.path
       if(!localAvatarPath)
       {
        throw new ApiError(401, "Avatar image is requyired || local path requried")
       }

       //2 find user from database
       const user= await User.findById(req.user._id).select("-password")

       if(!user)
       {
        throw new ApiError(401,"invalid user" )
       }
       // delete old avatar from cloudinary -> chhor diye abhi q ki delete krne ke liye pic ka public id chahiye 
       // to at starting time me hi dada base pe store krna hoga ye last me krunga
       const deleteoldAvatar= await  deletefromCloudinary(user?.avatarUplicId)
        if(!deleteoldAvatar)
        {
          throw new ApiError(401, "not deletre old avatar from clouinary")
        }
       // now upload on clodinary
       const avatar= await uploadOnCloudinary(localAvatarPath)

       if(!avatar.url)
       {
        throw new ApiError(400, "Error while uploading avatat on clodinary")
       }

       // if successful upload then save in DB
       user.avatar=avatar.url
       user.avatarUplicId=avatar.public_id
       await user.save({validateBeforeSave: false})
       

       //return response
        return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"))

      }
  catch(error){
     if(error instanceof ApiError)
     {
      res.send(error.message)
     }
  }
 })

 const updateCoverImage = asyncHandler(async(req, res)=>{
  try{
       //1 take cover image from req.file
       const curCoverImage= req.file?.path

       if(!curCoverImage)
       {
        throw new ApiError(401, "cover Image is requere")
       }

       //2. find user from database
       const user= await User.findById(req.user._id).select("-password")

       //3. check old cover image have or not if have then delete
       if(user.coverImage)
       {
         const deleteCoverImg = await deletefromCloudinary(user?.coverPublicId)
          if(!deleteCoverImg)
          {
            throw new ApiError(401, "cover Image is Not deleted")
          }
       }

       // 4. upload new cover image on cloudinary
       const uploadcoverImg= await uploadOnCloudinary(curCoverImage);

       if(!uploadcoverImg)
       {
        throw new ApiError(401, "not uploade Cover Img")
       }

       // 5 set and save in DB
       user.coverImage= uploadcoverImg.url
       user.coverPublicId= uploadcoverImg.public_id

       await user.save({validateBeforeSave: false})

       //6 send response

       return res
       .status(200)
       .json(
        new ApiResponse(200, user, "Cover Image successfully Updated")
       )
     }
  catch(error){
                if(error instanceof ApiError)
                {
                  res.send(error.message)
                }
              }
 })

 // controller for count follower and fowollinh

 const getUserChannelProfile = asyncHandler(async(req, res)=>
 {
  try{
       // take user Name from url 
       const {username}= req.params 

       if(!username)
       {
        throw new ApiError(401, " userName is required")
       }

       // aggregation

       const channel = await User.aggregate(
        [
          {
            $match: {username: username?.toLowerCase()}
          },
          // lookup for find follower
          {
            $lookup: {
                       from: "Subscription",
                       localField: "-id",
                       foreignField:"channel",
                       as:"subscribers"
                     }
          },
          // lookup for find following
          {
            $lookup: {
                       from: "Subscription",
                       localField:"_id",
                       foreignField:"subscriber",
                       as:"subscribeTo"
                     }
          },
          // add field for count and gives sigmal who is subscribe or not
          {
            $addFields: {
                          subscribersCount : {
                                               $size: "$subscribers"
                                             },
                          channelSubscribeToCount: {
                                                     $size : "$subscribeTo"
                                                   },
                          isSubscribed : {
                                           $cond: {
                                                     if : {$in :[req.user?._id, "$subscribers.subscriber"]},
                                                     then: true,
                                                     else: false
                                                  }
                                         }
                        }
          },
          // project this all count 
          {
            $project : {
                         fullName: 1,
                         username: 1,
                         subscribersCount:1,
                         channelSubscribeToCount: 1,
                         isSubscribed: 1,
                         avatar: 1,
                         coverImage: 1,
                         email: 1
                       }
          }

        ]
       )

       if(!channel?.length)
       {
        throw new ApiError(401, " channel does not Exists")
       }

       // return response

       return res
       .status(200)
       .json(new ApiResponse(200, channel[0], " User channel fetched successfull"))
     }
  catch(error){
                if(error instanceof ApiError )
                {
                  res.send(error.message)
                }
              }
 })

export {
  registerUser,
  loginUser,
  // testcontroller
  logOutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile
}