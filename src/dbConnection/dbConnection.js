import mongoose  from "mongoose";
import { DB_Name } from "../Constants.js";

const conectionDB= async()=>{
    try{
         const connectionIstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
         
         console.log(`in mongoDB connected !! DB_Name: ${connectionIstance.connection.host}`);
       }
    catch(error){
                    console.log("MongoDB connection Failed", error);
                    process.exit(1);
                }
}
export default conectionDB;