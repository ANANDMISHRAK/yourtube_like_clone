import mongoose, {Schema} from "mongoose";
import { Video } from "./video.model";
const userSchema = new Schema(
    {
        userName:{
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

export const User = mongoose.model("User", userSchema)