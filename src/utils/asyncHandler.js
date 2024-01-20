const asyncHandler = (fn)=>{
    // async(req , res, next)=>{
    //     try{
    //          console.log("in asynHandelar")
    //          await fn(req, res, next)
    //        }
    //   catch(error)
    //   {
    //     res.send(error.code || 500).json(
    //         {
    //             sucess: false,
    //             message: error.message
    //         }
    //     )
    //   }
    // }

    return (req, res, next)=>{
      Promise.resolve(fn(req, res, next))
      .catch((err)=>next)
    }
}
export {asyncHandler}