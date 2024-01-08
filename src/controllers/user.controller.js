import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudeinary} from '../utils/cloudinary.js'

const registerUser = asyncHandler(async(req, res)=>{
   // 1) get user details from frontend 
   const {fullName, email, userName, password}= req.body 
  
   // check all field got or not
    if([fullName, email, userName, password].some((field)=>field?.trim()===""))
      {
        throw new ApiError(400, " All Fields are required")
      }
    
    // if got all field 
    // check user all ready exist or not
    const exitedUser= await User.findOne({
                                           $or: [{userName},{email}]
                                         })
    
    if(exitedUser)
    {
        throw new ApiError(409, "User allready exist with userName or Email")
    }

    // user not exit then
    // check avatar & coverImage --> avatar required and coverImage may be

    const avatarImageLocalPath= req.files?.avatar[0]?.path;

   // const coverInageLocalPath = req.files?.coverImage[0]?.path
    // cover image may be so got undifine so take handle it
    let coverInageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverInageLocalPath= req.files.coverImage[0].path
    }
    //validate avatar image 
    if(!avatarImageLocalPath)
    {
        throw new ApiError(400, " Avatar image must be require")
    }
    
    // if avatar is then -> upload backend to cloudinary
     const avatar = await uploadOnCloudeinary(avatarImageLocalPath)
     const coverImage = await uploadOnCloudeinary(coverInageLocalPath)

     // check successfully avatar upload or not
     if(!avatar)
     {
        throw new ApiError(400, " avatar is not uploaded on Cloudinary")
     }
      
     // yet all data sucessfully set , now need to create object and saVE IN database 
     const user = await User.create({
                                      fullName,
                                      email,
                                      userName:userName.tolowerCase(),
                                      avatar:avatar.url,
                                      coverImage:coverImage?.url || null,
                                      password
                                    }) 

    // check user save sucessfull & in response remove password and token
     const createUser= await User.findById(user._id).select("-password -refereshToken")

     if(!createUser)
     {
        throw new ApiError(500, "sometings went wrong While registering the User")
     }

     return res.status(201).json(
        new ApiResponse(200, createUser, "user registered Successfully")
     )

 }
)

export {registerUser}