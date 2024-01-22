import express from "express";
import{upload} from '../middlewares/multer.middleware.js'
//import {testcontroller} from "../controllers/user.controller.js";
import { changePassword, getCurrentUser, logOutUser, loginUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router= express();

console.log(" i am in router ")


router.route("/register").post(upload.fields([
  {name:"avatar", maxCount:1},
  {name:"coverImage", maxCount:1}
]),
 registerUser)

 router.route('/login').post(loginUser)

 //for log out
  router.route('/logout').post(verifyJWT, logOutUser)

  // refresh access token router
  router.route('/refresh-token').post(refreshAccessToken)

  //change password
  router.route('/change-password').post(verifyJWT ,changePassword)

  // current user profile
  router.route('/current-user').get(verifyJWT, getCurrentUser)

  // update fullName and email
  router.route('/update-account').patch(verifyJWT, updateAccountDetails)

  // update Avatar
   router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateAvatar)

   // update cover Image
   router.route('/update-coverimg').patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

//this test router working correctliy so in register router gives erroe due to controller in side callback function 
//this problem is due to asyncHandellar.js

//  router.route('/test').get(async(req, res)=>{ 
//   res.status(200).send("test successful fron router")
//  console.log('working in router')})

// router.get("/test", testcontroller )




export default router 