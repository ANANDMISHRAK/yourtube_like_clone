import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
// console.log("clod name",process.env.CLOUDINARY_CLOUD_NAME);
// console.log("clod key",process.env.CLOUDINARY_API_KEY);
// console.log("clod secret",process.env.CLOUDINARY_API_SECRET
const uploadOnCloudinary = async (localPath)=>{
    try{
      // console.log(" in  backend to cloudinary")
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

const deletefromCloudinary = async(pathOfCloudinary)=>{
  try{
       if(!pathOfCloudinary) return null
      // console.log(pathOfCloudinary)
      const result= await cloudinary.uploader
      .destroy(pathOfCloudinary,  {resource_type: 'auto'})

      // cloudinary.v2.api
      // .delete_resources([pathOfCloudinary], 
      //   { type: 'upload', resource_type: 'auto' })
      

       //console.log("delete cloudinary response : ", result)
          return result
    }
  catch(error){
               console.log("not work")
                  return null
              }
}
export { uploadOnCloudinary,
         deletefromCloudinary
       }