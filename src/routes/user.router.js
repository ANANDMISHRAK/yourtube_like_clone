import express from "express";
import{upload} from '../middlewares/multer.middleware.js'
//import {testcontroller} from "../controllers/user.controller.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
const router= express();

console.log(" i am in router ")


router.route("/register").post(upload.fields([
  {name:"avatar", maxCount:1},
  {name:"coverImage", maxCount:1}
]),
 registerUser)

 router.route('/login').post(loginUser)

//this test router working correctliy so in register router gives erroe due to controller in side callback function 
//this problem is due to asyncHandellar.js

//  router.route('/test').get(async(req, res)=>{ 
//   res.status(200).send("test successful fron router")
//  console.log('working in router')})

// router.get("/test", testcontroller )




export default router 