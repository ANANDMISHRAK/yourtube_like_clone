import dotenv from "dotenv"
import conectionDB from "./dbConnection/dbConnection.js"



dotenv.config({
                path:"./env"
              })
    
conectionDB();