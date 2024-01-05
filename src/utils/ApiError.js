class ApiError extends Error
{
    constructor(
                statusCode,
                message="Someting Went wrong",
                error=[],
                statck=""
               )
               {
                 super(message),
                 this.statusCode= statusCode,
                 this.data= nullthis.success= false,
                 this.error=error

                 if(statck)
                 {
                    this.stack=statck
                 }
                 else
                 {
                    Error.captureStackTrace(this, this.constructor)
                 }
               }
}

export {ApiError}