import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"


cloudinary.config({ 
  cloud_name:process.env.CLOUDINERY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localPath)=>{
    try{
          if(! localPath) return null

          const result = await cloudinary.uploader.upload(
                                                           localPath,
                                                           {resource_type: 'auto'}
                                                         )
            // upload sucessfull 
            // then delete photo and video from backend for load problem 
            fs.unlinkSync(localPath)
            return result
       }
     catch(error)
     {
        // got error during upload 
        // then photo or video delete from Backend and return error or null accoding to need
         fs.unlinkSync(localPath)
         return null;
     }
}