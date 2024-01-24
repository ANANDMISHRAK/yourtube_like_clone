import mongoose, {Schema} from "mongoose";
import { User } from "./user.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile:{
                    type: {
                            url :String,
                            public_id: String
                          },
                    require: true
                  },
        thumbnail:{
                   type: {
                           url :String,
                           public_id: String
                          },
                    require: true
                  },
        title:{
               type: String,
               require:true
              },
        description:{
                     type:String,
                     require:true
                    },
        duration:{
                   type: Number,
                   require:true
                 },
        view:{
              type:Number,
              require: true
             },
        isPublished:{
                     type: Boolean,
                     default:true
                    },
        owner:{
               type:Schema.Types.ObjectId,
               ref:"User"
              }
    },
    {
        timestamps:true
    }
)


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)