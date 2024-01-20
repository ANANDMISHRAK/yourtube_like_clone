import mongoose, {Schema} from "mongoose";
//import { Video } from "./video.model";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";

console.log(" i am in user model")
const userSchema = new Schema(
    {
        username:{
                   type: String,
                   require:true,
                   unique:true,
                   lowercase: true,
                   trim: true,
                   index:true
                 },
        email:{
                type:String,
                require:true,
                unique:true,
                lowercase:true,
                trim:true
              },
        fullName:{
                   type:String,
                   require:true,
                   trim:true,
                   index:true
                 },
        avatar:{
                 type:String,
                 require:true,
               },
        coverImage:{
                     typr: String,
                   },
        password:{
                   type: String,
                   require:[true, 'Password is required']
                 },
        watchHistory:[
                       {
                         type: Schema.Types.ObjectId,
                         ref: "Video"
                       }
                    ],
        refreshToken:{
                       type:String
                     },
        accessToken:{
                      type: String
                    }
            
    },
   {
    tymestamps:true
   }
)

 // here write the middleware pre for event : save , bcrypt the password : for security
  
 userSchema.pre("save", async function(next)
 {
    // gives true if not bcripted 
    if(this.isModified("password"))
    {
     // console.log("wait for bcrypt password in userSchema pre middleware")
      this.password= await bcrypt.hash(this.password, 10)
     // console.log(this.password)
    }
    next()
 })

 // write method for password campair, user put password && DB save password


//  userSchema.methods.isPasswordCorrect = async function(password){
//   return await bcrypt.compare(password, this.password)
// }
  userSchema.methods.isPasswordCorrect = async function(password)
  {
    // console.log("copm pass word in userschema")
    return await bcrypt.compare(password, this.password)
  }

  // generate Access token Method 
  userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email:this.emai,
        username: this.userName,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRT,
    {
     expiresIn: process.env.ACCESS_TOKEN_EXPIRY   
    })
  }

  // generate Refresh Token Method
  userSchema.methods.generateRefreshToken =function(){
    return jwt.sign({
        _id: this._id,
        email:this.emai,
        username: this.userName,
        fullName: this.fullName
    },
    process.env.REFRESH_TOKEN_SECRT,
    {
     expiresIn: process.env.REFRESH_TOKEN_EXPIRY   
    }) 
  }

export const User = mongoose.model("User", userSchema)