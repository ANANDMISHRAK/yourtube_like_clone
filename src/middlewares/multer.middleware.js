import multer from "multer";

const storage = multer.diskStorage(
    {
    
        destination: function(req, file, cb)
        {
            //upload in  local system to backend file 
            cb(null, "./Public/temp")
        },
        filename: function(req, file, cb)
        {
             // file name in Backend of these photo is same is original name in local system
            cb(null, file.originalname)
        }
    }
)

export const upload= multer({storage})