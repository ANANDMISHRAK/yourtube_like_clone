 import { asyncHandler } from "../utils/asyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 //import { ApiResponse } from "../utils/ApiResponse.js";
 import  Jwt  from "jsonwebtoken";
 import { User } from "../models/user.model.js";

  export const verifyJWT =asyncHandler(async(req, res, next)=>{
    try{
        // here check user login or not using cookies value access token if login then send responce user value
        //1 ) take access token from cookies -> req.cookies(from server )or req.header (from frontend )
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

         if(!token)
         {
            throw new ApiError(401, "unAuthorized request -> not login user")
         }

         //2) if got access token then decode -> due to real value of user

         const decodeToken= await Jwt.verify(token,process.env.ACCESS_TOKEN_SECRT)

         //3) find user from dataBase using decodeToken
         const user= await User.findById(decodeToken?._id).select("-password -refreshToken")

         //4) check user got or not
         if(!user)
         {
            throw new ApiError(401, " Invalid Access Token")
         }

         // user got set in res
         req.user =user

         // middleware work complited then call next
         next()


       }
    catch(error){
                  if(error instanceof ApiError)
                  {
                    res.send(error.message)
                  }
                }
  })
