const asyncHandler = (fn)=>{
    async(req , res, next)=>{
        try{
             await fn(req, res, next)
           }
      catch(error)
      {
        res.send(error.code || 500).json(
            {
                sucess: false,
                message: error.message
            }
        )
      }
    }
}