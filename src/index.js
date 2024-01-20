import dotenv from "dotenv"
import conectionDB from "./dbConnection/dbConnection.js"
import {app} from "./app.js"


dotenv.config({
                path:"./.env"
              })
    
conectionDB()
.then(()=>{
            app.on("error", (error)=>{
                                       console.log(error);
                                       throw error;
                                     })
            app.listen(process.env.PORT || 8000, ()=>{
                                                      console.log(`server is running at port: ${process.env.PORT}`)
                                                     }) 
          })
.catch((error)=>{
                  console.log("Mongo DB connection failed", error)
                })              