import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addVideoInPlaylist,
         createPlaylist,
         deletePlaylist,
         getPlaylistByID,
         getUserAllPlaylis,
         removeVideoFromPlaylist,
         updatePlaylist
     } from '../controllers/playlist.controller.js'


const router= express.Router()

// create playlist router
router.route('/create-playlist').post(verifyJWT, createPlaylist)

//add video in playlist
router.route('/add-video/:playlistId/:videoId').patch(verifyJWT, addVideoInPlaylist)

//remove video from playlist
router.route('/remove/:videoId/:playlistId').patch(verifyJWT, removeVideoFromPlaylist)

//get playlist by id
router.route('/get-playlist/:playlistId').get(verifyJWT,getPlaylistByID)

//get user all playlist
router.route('/user-playlist/:userId').get(verifyJWT, getUserAllPlaylis)

//update playlist
router.route('/update-playlist/:playlistId').patch(verifyJWT, updatePlaylist)

//delete playlist
router.route('/delete-playlist/:playlistId').delete(verifyJWT, deletePlaylist)


export default router