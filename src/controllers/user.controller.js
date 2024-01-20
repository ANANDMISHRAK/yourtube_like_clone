import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'

// generate access token method
const generateAccessAndRefreshToken = async (userid) => {
  try {
   // console.log("in side user registration controller")
    const user = await User.findById(userid)

    const acessToken = user.generateAccessToken()
   // console.log(acessToken);
    const refereshToken = user.generateRefreshToken()
   // console.log(refereshToken)

    user.refreshToken = refereshToken
    //console.log("user.retocken  : ", user.refereshToken)
    await user.save({ validateBeforeSave: false })

    return { acessToken, refereshToken }
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
  //console.log("email: ", email);
   
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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
  }
 

  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
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
  const { acessToken, refereshToken } = await generateAccessAndRefreshToken(user._id)

  //6. send throw coolis
  const loginUser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", acessToken, option)
    .cookie("refereshToken", refereshToken, option)
    .json(new ApiResponse(
      200,
      {
        user: loginUser, acessToken, refereshToken
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




export {
  registerUser,
  loginUser,
  // testcontroller
}